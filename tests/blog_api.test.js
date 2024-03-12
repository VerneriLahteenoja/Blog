const { test, after, beforeEach } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const Blog = require('../models/blog')
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

test('blog has an id', async () => {
    await api
        .get('/api/blogs')
        .expect(200)
        .expect(response => {
            response.body.forEach(blog => {
                assert.strictEqual(typeof blog.id, 'string')
            })
        })
})

test.only('blog can be posted', async () => {
    const newBlog = {
        title: "test blog",
        author: "test to delete",
        url: "nonexistent",
        likes: 5
    }
    await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)
    const blogs = await helper.blogsInDb()
    assert.strictEqual(blogs.length, helper.initialBlogs.length + 1)
})

test('blog likes at least 0', async () => {
    const newBlog = {
        title: "test likes",
        author: "test likes to delete",
        url: "nonexistent"
    }
    await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)
        .expect(response => {
            assert.strictEqual(response.body.likes, 0)
        })
})

test.only('return status(400) if no title or url', async () => {
    const newBlog = {
        author: "test 400 to delete",
    }
    await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(400)
    const blogs = await helper.blogsInDb()
    assert.strictEqual(blogs.length, helper.initialBlogs.length)
})


after(async () => {
    await mongoose.connection.close()
})
