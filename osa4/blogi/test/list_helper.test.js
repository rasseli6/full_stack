const { test, describe } = require('node:test')
const assert = require('node:assert')

const blogs = []

const { dummy, totalLikes, favoriteBlog, mostBlogs, mostLikes } = require('../utils/list_helper')

const manyblogs = [
    {
        "_id": "69dd1a56512c12791edd6676",
        "title": "Ihka ensimmäinen kokeilu",
        "author": "Rasmus",
        "url": "http://example.com",
        "likes": 50,
        "__v": 0
    },
    {

        "_id": "69dd1cc641cb7a944eb080cd",
        "title": "Ihka toinen kokeilu",
        "author": "Rasmus",
        "url": "http://example.com",
        "likes": 500,
        "__v": 0
    }
    ]

const zeroblog = []

const listWithOneBlog = [
    {
      _id: '5a422aa71b54a676234d17f8',
      title: 'Go To Statement Considered Harmful',
      author: 'Edsger W. Dijkstra',
      url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
      likes: 5,
      __v: 0
    }
  ]

  const allBlogs = listWithOneBlog.concat(manyblogs)
  


test('dummy palauttaa 1', () => {
    const result = dummy(blogs)

    assert.strictEqual(result, 1)
})

describe('total likes', () => {
  
    test('when list has many', () => {
    const result = totalLikes(manyblogs)
    assert.strictEqual(result, 550)
  })
    
    test('when list is empty', () => {
    const result = totalLikes(zeroblog)
    assert.strictEqual(result, 0)
  })

  test('when list has only one blog equals the likes of that', () => {
    const result = totalLikes(listWithOneBlog)
    assert.strictEqual(result, 5)
  })
})

describe('favoriteBlog', () => {
    test('when list has many favoriteblogs', () => {
    const result = favoriteBlog(manyblogs)
    assert.deepStrictEqual(result, manyblogs[1])
  })
    test('when list is empty of blog', () => {
    const result = favoriteBlog(zeroblog)
    assert.deepStrictEqual(result, null)
  })
  test('when list has only one blog equals the likes of that', () => {
    const result = favoriteBlog(listWithOneBlog)
    assert.deepStrictEqual(result, listWithOneBlog[0])
  })
})


describe('mostBlogs', () => {
  test('when list is empty returns null', () => {
    const result = mostBlogs(zeroblog)
    assert.deepStrictEqual(result, null)
  })
  test('when list has one blog returns that author and count 1', () => {
    const result = mostBlogs(listWithOneBlog)
    assert.deepStrictEqual(result, {
      author: 'Edsger W. Dijkstra',
      blogs: 1
    })
  })
  test('when list has many blogs returns author with most blogs', () => {
    const result = mostBlogs(allBlogs)
    assert.deepStrictEqual(result, {
      author: 'Rasmus',
      blogs: 2
    })
  })
})


describe('mostLikes', () => {
  test('when list is empty returns null', () => {
    const result = mostLikes(zeroblog)
    assert.deepStrictEqual(result, null)
  })
  test('when list has one blog returns that author and 5 likes', () => {
    const result = mostLikes(listWithOneBlog)
    assert.deepStrictEqual(result, {
      author: 'Edsger W. Dijkstra',
      likes: 5
    })
  })
  test('when list has many blogs returns author with most likes total', () => {
    const result = mostLikes(allBlogs)
    assert.deepStrictEqual(result, {
      author: 'Rasmus',
      likes: 550
    })
  })
})