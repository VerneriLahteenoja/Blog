const express = require('express')
const app = express()
const cors = require('cors')
const config = require('dotenv').config()
const mongoose = require('mongoose')

app.use(cors())
app.use(express.json())

const blogSchema = mongoose.Schema({
    title: String,
    author: String,
    url: String,
    likes: Number
})

const Blog = mongoose.model('Blog', blogSchema)

const mongoUrl = process.env.MONGODB_URI
mongoose.connect(mongoUrl)


app.get('/api/blogs', (req, res) => {
    Blog
    .find({})
    .then(blogs => {
        res.json(blogs)
    })
})

app.post('/api/blogs', (req, res) => {
    const blog = new Blog(req.body)

    blog
    .save()
    .then(result => {
        res.status(201).json(result)
    })
})

const PORT = 3003
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})