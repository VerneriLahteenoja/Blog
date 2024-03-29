const mongoose = require('mongoose')

const blogSchema = mongoose.Schema({
  title: {
    type: String,
    minLength: 1
  },
  author: {
    type: String,
    minLength: 1
  },
  url: {
    type: String,
    minLength: 1
  },
  likes: {
    type: Number
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
})
const Blog = mongoose.model('Blog', blogSchema)

blogSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})


module.exports = { Blog }