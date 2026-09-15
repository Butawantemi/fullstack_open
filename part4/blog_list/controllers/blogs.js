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

blogsRouter.delete('/:id', async (request, response) => {
  const deletedBlog = await Blog.findByIdAndDelete(request.params.id)

  if (!deletedBlog) {
    return response.status(404).json({ error: 'blog not found' })
  }

  response.status(204).end()
})

blogsRouter.put('/:id', async (request, response) => {
  const { title, author, url, likes } = request.body

  const updatedFields = { title, author, url, likes }
  const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, updatedFields, { returnDocument: 'after', runValidators: true })

  if (!updatedBlog) {
    return response.status(404).json({ error: 'blog not found' })
  }
  response.status(200).json(updatedBlog)
})

module.exports = blogsRouter