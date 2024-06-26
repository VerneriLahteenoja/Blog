const blogsRouter = require('express').Router()
const middleware = require('../utils/middleware')
const { Blog } = require('../models/blog')
const { User } =  require('../models/user')
const { Comment } = require('../models/comment')

blogsRouter.get('/', async (req, res) => {
  const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 })
  res.status(200).json(blogs)
})

blogsRouter.post('/', middleware.userExtractor, async (req, res) => {
  const body = req.body
  if (!req.user) {
    return res.status(401).json({ error: 'token invalid' })
  }

  if (!body.title || !body.url) {
    return res.status(400).end()
  }

  const user = await User.findById(req.user.id)
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
  await savedBlog.populate('user', { username: 1, name: 1 })
  res.status(201).json(savedBlog)
})

blogsRouter.post('/:id/comments', async (req, res) => {
  // if (!req.user) {
  //   return res.status(401).json({ error: 'token invalid' })
  // }
  const blog = await Blog.findById(req.params.id)
  const comment = {
    comment: req.body.comment,
    blog: blog._id
  }
  const newComment = new Comment(comment)
  const savedComment = await newComment.save()
  await savedComment.populate('blog', { title: 1})
  res.status(201).json(newComment)
})

blogsRouter.get('/comments', async (req, res) => {
  const comments = await Comment.find({}).populate('blog', { title: 1})
  res.status(200).json(comments)
})

blogsRouter.delete('/:id', middleware.userExtractor, async (req, res) => {
  if (!req.user) {
    return res.status(401).json({ error: 'token invalid' })
  }

  const blogToDelete = await Blog.findById(req.params.id)
  if (!(req.user.id === blogToDelete.user.toString()))
    return res.status(401).json({ error: 'current user not authorized to delete'})

  const user = await User.findById(req.user.id)  
  user.blogs = user.blogs.filter(blog => blog._id.toString() !== blogToDelete._id.toString())
  await user.save()
  
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
  const updatedBlog = await Blog
    .findByIdAndUpdate(req.params.id, updateData, { new: true, runValidators: true })
    .populate('user', { username: 1, name: 1 })
  res.status(200).json(updatedBlog)
})


module.exports = blogsRouter