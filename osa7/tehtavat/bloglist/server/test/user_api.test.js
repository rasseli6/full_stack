const { test, describe, beforeEach, after } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const supertest = require('supertest')
const app = require('../app')
const User = require('../models/users')

const api = supertest(app)

describe('when there is only one user at database', () => {
  beforeEach(async () => {
    await User.deleteMany({})

    const passwordHash = await bcrypt.hash('sekret', 10)
    const user = new User({
      username: 'root',
      name: 'Megauser',
      passwordHash
    })

    await user.save()
  })

  test('succeeds with creating a new username', async () => {
    const usersAtStart = await User.find({})

    const newUser = {
      username: 'kaasunalle',
      name: 'Nalle Puh',
      password: 'hunaja'
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await User.find({})
    assert.strictEqual(usersAtEnd.length, usersAtStart.length + 1)

    const usernames = usersAtEnd.map(u => u.username)
    assert(usernames.includes(newUser.username))
  })

  test('creation fails if username is taken', async () => {
    const usersAtStart = await User.find({})

    const newUser = {
      username: 'root',
      name: 'Another Root',
      password: 'susisalainen'
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    assert(result.body.error.includes('expected `username` to be unique'))

    const usersAtEnd = await User.find({})
    assert.strictEqual(usersAtEnd.length, usersAtStart.length)
  })

  test('creation fails if username is less than 3', async () => {
    const usersAtStart = await User.find({})

    const newUser = {
      username: 'ab',
      name: 'Pikku Myy',
      password: 'testingtesting'
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    assert(result.body.error)

    const usersAtEnd = await User.find({})
    assert.strictEqual(usersAtEnd.length, usersAtStart.length)
  })

  test('creation fails if password is shorter than 3', async () => {
    const usersAtStart = await User.find({})

    const newUser = {
      username: 'Muumi11',
      name: 'Muumi Peikko',
      password: 'ab'
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    assert(result.body.error.includes('password must be at least 3 characters long'))

    const usersAtEnd = await User.find({})
    assert.strictEqual(usersAtEnd.length, usersAtStart.length)
  })
})

after(async () => {
  await mongoose.connection.close()
})