const blogsRouter = require('express').Router()
const Blog = require('../models/blog')

blogsRouter.get('/', async (req, res) => {
  const blogs = await Blog.find({})
  res.json(blogs)
})

blogsRouter.post('/', async (req, res) => {
  const body = req.body
  if (!body.title || !body.url) {
    return res.status(400).end()
  }
  const blog = {
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes || 0
  }
  const newBlog = new Blog(blog)
  const savedBlog = await newBlog.save()
  res.status(201).json(savedBlog)
})


module.exports = blogsRouter