const blogsRouter = require('express').Router()
const Blog = require('../models/blogs')
const { userExtractor } = require('../utils/middleware')


blogsRouter.get('/', async(request, response) => {
  const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 })
  response.json(blogs)

})

// Create a blog controller
blogsRouter.post('/', userExtractor ,async (request, response) => {
  const body = request.body
  const user = request.user

  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes,
    user: user._id
  })

  const savedBlog = await blog.save()
  user.blogs = user.blogs.concat(savedBlog._id)
  await user.save()
  response.status(201).json(savedBlog)
})

// Delete a blog controller
blogsRouter.delete('/:id', userExtractor, async (request, response) => {
  const user = request.user

  const blog = await Blog.findById(request.params.id)

  if (!blog) {
    return response.status(404).json({ error: 'blog not found' })
  }

  if (blog.user.toString() !== user._id.toString()) {
    return response.status(401).json({ error: 'unauthorized: only the creator can delete this blog' })
  }

  await Blog.findByIdAndDelete(request.params.id)
  response.status(204).end()
})

// Update a blog controller
blogsRouter.put('/:id',userExtractor, async (request, response) => {
  const { title, author, url, likes } = request.body
  const user = request.user

  const blog = await Blog.findById(request.params.id)

  if (!blog) {
    return response.status(404).json({ error: 'blog not found' })
  }

  if (blog.user.toString() !== user._id.toString()) {
    return response.status(401).json({ error: 'unauthorized: only the creator can update this blog' })
  }

  const updatedFields = { title, author, url, likes }
  const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, updatedFields, { returnDocument: 'after', runValidators: true })

  if (!updatedBlog) {
    return response.status(404).json({ error: 'blog not found' })
  }
  response.status(200).json(updatedBlog)
})

module.exports = blogsRouter