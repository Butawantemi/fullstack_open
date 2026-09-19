const Blog = require('../models/blogs')

const blogsAtStart = async (userId) => {
  return [
    {
      title: 'First class tests',
      author: 'Robert C. Martin',
      url: 'http://cleancoder.com',
      likes: 10,
      user: userId
    },
    {
      title: 'Canonical string reduction',
      author: 'Edsger W. Dijkstra',
      url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
      likes: 12,
      user: userId
    }
  ]
}

const blogsInDB = async () => {
  const blogs = await Blog.find({})
  return blogs.map(blog => blog.toJSON())
}

module.exports = {  blogsInDB, blogsAtStart }