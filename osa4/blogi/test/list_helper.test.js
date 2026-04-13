const { test, describe } = require('node:test')
const assert = require('node:assert')

const blogs = []

const dummy = require('../utils/list_helper').dummy
const totalLikes = require('../utils/list_helper').totalLikes

test('dummy palauttaa 1', () => {
    const result = dummy(blogs)

    assert.strictEqual(result, 1)
})

describe('total likes', () => {
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
  const zeroblog = []
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