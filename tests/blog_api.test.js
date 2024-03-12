const { test, after, beforeEach } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const Blog = require('../models/blog')
const { initialBlogs } = require('./test_helper')
const helper = require('./test_helper')

const api = supertest(app)

beforeEach(async () => {
    await Blog.deleteMany({})
    let blogObjects = helper.initialBlogs
        .map(blog => new Blog(blog))

    const promiseArray = blogObjects.map(blog => blog.save())
    await Promise.all(promiseArray)
})

test('blogs are returned as json', async () => {
    await api
        .get('/api/blogs')
        .expect(200)
        .expect('Content-Type', /application\/json/)
})

test('return right amount of blogs', async () => {
    await api
        .get('/api/blogs')
        .expect(200)
        .field()
        .expect(response => {
            assert.strictEqual(response.body.length, 3)
        })
})

test.only('blog has an id', async () => {
    await api
        .get('/api/blogs')
        .expect(200)
        .expect(response => {
            response.body.forEach(blog => {
                assert.strictEqual(typeof blog.id, 'string')
            })
        })
})


after(async () => {
    await mongoose.connection.close()
})
