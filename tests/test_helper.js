const { Blog } = require('../models/blog')
const { User } = require('../models/user')

const initialBlogs = [
  {
    title: 'first blog',
    author: 'Matti Mallinen',
    url: 'nonexistent',
    likes: 1
  },
  {
    title: 'second blog',
    author: 'Timo Testi',
    url: 'nonexistent',
    likes: 2
  },
  {
    title: 'third blog',
    author: 'Maija Murkku',
    url: 'nonexistent',
    likes: 3
  }
]

const blogsInDb = async () => {
  const blogs = await Blog.find({})
  return blogs.map(blog => blog.toJSON())
}

const usersInDb = async () => {
  const users = await User.find({})
  return users.map(user => user.toJSON())
}

module.exports = {
  initialBlogs,
  blogsInDb,
  usersInDb
}