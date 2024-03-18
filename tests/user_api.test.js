const { test, after, beforeEach, describe } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const helper = require('./test_helper')
const bcrypt = require('bcrypt')
const { User } = require('../models/user')

const api = supertest(app)

describe('tests with initial data', () => {
  beforeEach(async () => {
    await User.deleteMany({})
    const passwordHash = await bcrypt.hash('secret', 10)
    const user = new User({ username: 'root', password: passwordHash })
    await user.save()
  })
  test('create new user with status 201', async () => {
    const usersAtStart = await helper.usersInDb()
    const newUser = {
      username: 'Tester',
      name: 'Testi Testeri',
      password: 'salainen'
    }
    await api
      .post('/api/users') 
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/)
    const usersAtEnd = await helper.usersInDb()
    assert.strictEqual(usersAtEnd.length, usersAtStart.length + 1)
    const usernames = usersAtEnd.map(user => user.username)
    assert(usernames.includes(newUser.username))
  })
})

after(async () => {
  await mongoose.connection.close()
})