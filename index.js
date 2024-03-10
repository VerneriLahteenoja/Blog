const express = require('express')
const app = express()
const cors = require('cors')
const mongoose = require('mongoose')

const blogSchema = mongoose.Schema({
    title: String,
    author: String,
    url: String,
    likes: Number
})

const Blog = mongoose.model('Blog', blogSchema)

const mongoUrl = 'mongodb://localhost/bloglist'
mongoose.connect(mongoUrl)

app.use(cors())
app.use(express.json())

app.get('/api/blogs', (req, res) => {
    Blog
    .find({})
    .then(blogs => {
        response.json(blogs)
    })
})

app.post('api/blogs', (req, res) => {
    const blog = new Blog(req.body)

    blog
    .save()
    .then(res => {
        res.status(201).json(res)
    })
})

const PORT = 3003
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})