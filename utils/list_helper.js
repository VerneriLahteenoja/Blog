const _ = require('lodash')

const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  return 0 ? blogs.length === 0 : blogs.reduce((sum, item) => {
    return sum + item.likes
  }, 0)
}

const favoriteBlog = (blogs) => {
  let result = blogs.reduce((prev, item) => {
    return prev.likes > item.likes ? prev : item
  }, 0)
  return { title: result.title, author: result.author, likes: result.likes}
}

const mostBlogs = (blogs) => {
  const authors = _.countBy(blogs, 'author') // Create a dict with authors as keys: amount of blogs as vals
  const authorWithMost = _.maxBy(_.keys(authors), author => authors[author]) // Iterate over authors.keys array to find biggest val
  const mostBlogs = authors[authorWithMost]
  return { author: authorWithMost, blogs: mostBlogs }
}

const mostLikes = (blogs) => {
  const authorGroups = _.groupBy(blogs, 'author')
  const authorLikes = _.mapValues(authorGroups, (author) => _.sumBy(author, 'likes'))
  const mostLikedAuthor = _.maxBy(_.keys(authorLikes), author => authorLikes[author])
  return { author: mostLikedAuthor, likes: authorLikes[mostLikedAuthor] }
}



module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes
}