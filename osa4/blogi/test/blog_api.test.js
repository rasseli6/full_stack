const assert = require('node:assert')
const bcrypt = require('bcrypt')
const User = require('../models/users')
const { test, after, beforeEach, describe } = require('node:test')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const Blog = require('../models/blog')

const api = supertest(app)

const initialBlogs = [{
        "title": "Ihka ensimmäinen kokeilu",
        "author": "Rasmus",
        "url": "http://example.com",
        "likes": 50
    },
    {
        "title": "Ihka toinen kokeilu",
        "author": "Rasmus",
        "url": "http://example.com",
        "likes": 500
    }, 
    {
      title: 'Go To Statement Considered Harmful',
      author: 'Edsger W. Dijkstra',
      url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
      likes: 5
    }
]
const loginAndGetToken = async () => {
  const response = await api.post('/api/login').send({username: 'kaksoisklikkaus', password: 'salainenTodella'})
  return response.body.token
}

beforeEach(async () => {
    await Blog.deleteMany({})
    await User.deleteMany({})
    const passwordHash = await bcrypt.hash('salainenTodella', 10)
    const user = new User({
        username: 'kaksoisklikkaus',
        name: 'Kaksois Klikkaus',
        passwordHash
    })
    const savedUser = await user.save()
    for (const blog of initialBlogs) {
        const blogObject = new Blog({
            ...blog, 
            user: savedUser._id})
        await blogObject.save()
    }
})

test('blogs are returned as json', async () => {
    await api.get('/api/blogs').expect(200).expect('Content-Type', /application\/json/)
})

test('as many blogs are returned as needed', async () => {
    const response = await api.get('/api/blogs')
    assert.strictEqual(response.body.length, initialBlogs.length)
})

test('_id is id', async() => {
    const response = await api.get('/api/blogs')
    
    assert.notStrictEqual(response.body[0].id, undefined, 'Blog has not a id field')
})

test('new blog posted', async() => {
    const newBlog = {"title": "Ihka ainoa kokeilu",
        "author": "Rasmus",
        "url": "http://example.com",
        "likes": 38}

    const token = await loginAndGetToken()
    
    await api.post('/api/blogs').set('Authorization', `Bearer ${token}`).send(newBlog).expect(201).expect('Content-Type', /application\/json/)

    const response = await api.get('/api/blogs')

    const contents = response.body.map(r => r.title)
    assert.strictEqual(response.body.length, initialBlogs.length + 1)
    assert(contents.includes(newBlog.title))
})

test('likes missing, assume its 0', async () => {
    const newestBlog = {
        title: 'Blog Without love',
        author: 'Rasse',
        url: 'http://example.com/no-love'
    }
    const token = await loginAndGetToken()

    const postResponse = await api.post('/api/blogs').set('Authorization', `Bearer ${token}`).send(newestBlog).expect(201).expect('Content-Type', /application\/json/)
    assert.strictEqual(postResponse.body.likes, 0)
})
test('url not added', async () => {
    const newBlog = {
        title: "Without url",
        author: "Rasse",
        likes: 1
    }
    const token = await loginAndGetToken()
    await api.post('/api/blogs').set('Authorization', `Bearer ${token}`).send(newBlog).expect(400)
    const urlresponse = await api.get('/api/blogs')
    assert.strictEqual(urlresponse.body.length, initialBlogs.length)
})

test('blog wihtout title', async () => {
    const newBlog = {
        url: "goggeli.com",
        author: "Rasse",
        likes: 3
    }
    const token = await loginAndGetToken()
    await api.post('/api/blogs').set('Authorization', `Bearer ${token}`).send(newBlog).expect(400)
    const response = await api.get('/api/blogs')
    assert.strictEqual(response.body.length, initialBlogs.length)
})

test('delete of a blog and succeed with 204 when id is valid', async () => {
    const blogsAtStart = await api.get('/api/blogs') 
    const blogToDelete = blogsAtStart.body[0]

    await api.delete(`/api/blogs/${blogToDelete.id}`).expect(204)

    const blogsAtEnd = await api.get('/api/blogs') 
    const titles = blogsAtEnd.body.map(blog => blog.title)

    assert(!titles.includes(blogToDelete.title))
    assert.strictEqual(blogsAtEnd.body.length, initialBlogs.length -1)
})

test('likes of a blog can be updated', async () => {
    const blogsAtStart = await api.get('/api/blogs')
    const blogToUpdate = blogsAtStart.body[0]

    const updatedBlog = {
        ...blogToUpdate,
        likes: 888
    }
    const response = await api.put(`/api/blogs/${blogToUpdate.id}`).send(updatedBlog).expect(200).expect('Content-Type', /application\/json/)
    assert.strictEqual(response.body.likes, 888)

    const blogsAtEnd = await api.get('/api/blogs')
    const changeBlog = blogsAtEnd.body.find(blog => blog.id === blogToUpdate.id)

    assert.strictEqual(changeBlog.likes, 888)
})

after(async () => {
    await mongoose.connection.close()
})