const blogsRouter = require('express').Router()
const { Blog } = require('../models/blog')
const { User } =  require('../models/user')

blogsRouter.get('/', async (req, res) => {
  const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 })
  res.status(200).json(blogs)
})

blogsRouter.post('/', async (req, res) => {
  const body = req.body
  if (!body.title || !body.url) {
    return res.status(400).end()
  }
  const user = await User.findById(body.userId)
  const blog = {
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes || 0,
    user: user._id
  }
  const newBlog = new Blog(blog)
  const savedBlog = await newBlog.save()
  user.blogs = user.blogs.concat(savedBlog._id)
  await user.save()
  res.status(201).json(savedBlog)
})

blogsRouter.delete('/:id', async (req, res) => {
  await Blog.findByIdAndDelete(req.params.id)
  res.status(204).end()
})

blogsRouter.put('/:id', async (req, res) => {
  const body = req.body
  const updateData = {
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes || 0
  }
  const updatedBlog = await Blog.findByIdAndUpdate(req.params.id, updateData, { new: true, runValidators: true })
  res.status(200).json(updatedBlog)
})


module.exports = blogsRouter