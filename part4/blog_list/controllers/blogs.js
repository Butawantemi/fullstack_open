const blogsRouter = require('express').Router()
const Blog = require('../models/blogs')


blogsRouter.get('/', async(request, response) => {
  const blogs = await Blog.find({})
  response.json(blogs)

})

blogsRouter.post('/', async (request, response) => {
  const body = request.body

  if (!body.title) {
    return response.status(400).end()
  }

  if (!body.url) {
    return response.status(400).end()
  }

  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes
  })

  const newBlog = await blog.save()
  response.status(201).json(newBlog)
})

module.exports = blogsRouter