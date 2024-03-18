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
  test('try to create a duplicate, results in status 400', async () => {
    const usersAtStart = await helper.usersInDb()
    const newUser = {
      username: 'root',
      name: 'dup root',
      password: 'salainen'
    }
    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)
    const usersAtEnd = await helper.usersInDb()
    assert(result.body.error.includes('expected `username` to be unique'))
    assert.strictEqual(usersAtEnd.length, usersAtStart.length)
  })
  test('username is too short or missing, results in status 400', async () => {
    const usersAtStart = await helper.usersInDb()
    const newUser = {
      username: '',
      name: 'faulty user',
      password: 'faulty user'
    }
    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)
    const usersAtEnd = await helper.usersInDb()
    assert(result.body.error.includes('User validation failed'))
    assert.strictEqual(usersAtStart.length, usersAtEnd.length)
  })
  test('password is too short or missing, results in status 400', async () => {
    const usersAtStart = await helper.usersInDb()
    const newUser = {
      username: 'faulty password',
      name: 'faulty password',
      password: ''
    }
    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)
    const usersAtEnd = await helper.usersInDb()
    assert(result.body.error.includes('faulty or missing password'))
    assert.strictEqual(usersAtStart.length, usersAtEnd.length)
  })
})

after(async () => {
  await mongoose.connection.close()
})