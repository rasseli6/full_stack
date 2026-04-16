const assert = require('node:assert')
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
beforeEach(async () => {
    await Blog.deleteMany({})
    for (const blog of initialBlogs) {
        const blogObject = new Blog(blog)
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

after(async () => {
    await mongoose.connection.close()
})