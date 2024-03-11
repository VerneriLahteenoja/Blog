const express = require('express')
const app = express()
const cors = require('cors')
const config = require('./utils/config')
const blogsRouter = require('./controllers/blogs')
const mongoose = require('mongoose')

app.use(cors())
app.use(express.json())
app.use('/api/blogs', blogsRouter)

mongoose.connect(config.MONGODB_URI)


module.exports = app