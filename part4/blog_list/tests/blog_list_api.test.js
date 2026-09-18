const assert = require('node:assert')
const { test, beforeEach, after, describe } = require('node:test')
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const supertest = require('supertest')
const app = require('../app')


const Blog = require('../models/blogs')
const helper = require('./test_helper')
const User = require('../models/user')

const api = supertest(app)


beforeEach(async () => {
  await Blog.deleteMany({})

  const blogObject = helper.initialBlogs.map(blog => new Blog(blog))
  const promiseArray = blogObject.map(blog => blog.save())
  await Promise.all(promiseArray)
})

test('return the correct amount of blog post in json format', async () => {
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)

  const response = await api.get('/api/blogs')
  assert.strictEqual(response.body.length, helper.initialBlogs.length)
})

test('blog posts have a unique identifier property named id', async () => {
  const response = await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)

  const blogs = response.body
  assert.notStrictEqual(blogs.length, 0)

  const firstBlog = blogs[0]

  assert.notStrictEqual(firstBlog.id, undefined)
  assert.strictEqual(firstBlog._id, undefined)
})

test('create a post and verify that the content of the blog post is saved correctly to the database', async () => {
  const newBlog = {
    title: 'My first blog.',
    author: 'Japhet Paul',
    url: 'https://fullstackopen.com',
    likes: 60,
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const blogAtEnd = await helper.blogsInDB()
  assert.strictEqual(blogAtEnd.length, helper.initialBlogs.length + 1)

  const title = blogAtEnd.map(blog => blog.title)
  assert(title.includes('My first blog.'))
})

test('if the likes property is missing, it defaults to 0', async () => {
  const newBlogWithoutLikes = {
    title: 'New blog post without likes',
    author: 'Japhet Paul',
    url: 'https://fullstackopen.com',
  }

  const response = await api
    .post('/api/blogs')
    .send(newBlogWithoutLikes)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  assert.strictEqual(response.body.likes, 0)
})

test('backend responds with 400 Bad Request if title is missing', async () => {
  const blogWithoutTitle = {
    author: 'Japhet Paul',
    url: 'https://fullstackopen.com',
  }

  await api
    .post('/api/blogs')
    .send(blogWithoutTitle)
    .expect(400)
})

test('backend responds with 400 Bad Request if url is missing', async () => {
  const blogWithoutUrl = {
    title: 'New blog post without likes',
    author: 'Japhet Paul',
  }

  await api
    .post('/api/blogs')
    .send(blogWithoutUrl)
    .expect(400)
})

test('succeeds with status code 204 if id is valid', async () => {
  const blogAtStart = await helper.blogsInDB()
  const blogToDelete = blogAtStart[0]
  await api
    .delete(`/api/blogs/${blogToDelete.id}`)
    .expect(204)

  const blogAtEnd = await helper.blogsInDB()
  const ids = blogAtEnd.map(blog => blog.id)
  assert(!ids.includes(blogToDelete.id))

  assert.strictEqual(blogAtEnd.length, helper.initialBlogs.length - 1)
})

test('succeeds update a blog post with status code 200 if id is valid', async () => {
  const blogsBeforeUpdate = await helper.blogsInDB()
  const blogToUpdate = blogsBeforeUpdate[0]

  const blogUpdate = {
    title: 'Test use super test.',
    author: blogToUpdate.author,
    url: 'https://fullstackopen.com/en/part4',
    likes: 100,
  }
  await api
    .put(`/api/blogs/${blogToUpdate.id}`)
    .send(blogUpdate)
    .expect(200)
    .expect('Content-Type', /application\/json/)

  const blogsAfterUpdate = await helper.blogsInDB()
  const updatedBlogInDb = blogsAfterUpdate.find(blog => blog.id === blogToUpdate.id)
  assert.strictEqual(updatedBlogInDb.title, blogUpdate.title)
  assert.strictEqual(updatedBlogInDb.likes, blogUpdate.likes)
})

//Start here.

describe('Create a user', () => {
  beforeEach(async () => {
    await User.deleteMany({})
    await Blog.deleteMany({})
    const passwordHash = await bcrypt.hash('secret123', 10)
    const user = User({
      username: 'root',
      name: 'Super User',
      passwordHash
    })

    await user.save()
  })


  test('Create a user', async () => {
    const usersAtStart = await User.find({})

    const newUser = {
      username: 'tester',
      name: 'Tester User',
      password: 'Arush@2027'
    }
    await api
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await User.find({})
    assert.strictEqual(usersAtEnd.length, usersAtStart.length + 1)

    const usernames = usersAtEnd.map(u => u.username)
    assert(usernames.includes('tester'))
  })

  test('Dublicate username return 400 bad request', async () => {
    await api
      .post('/api/users')
      .send({ username: 'root', password: 'Arusha@2027' })
      .expect(400)
  })

  test('create a post and verify that the content of the blog post is saved correctly to the database', async () => {
    const users = await User.find({})
    const firstUser = users[0]
    const blogsAtStart = await helper.blogsInDB()

    const newBlog = {
      title: 'My first blog.',
      author: 'Japhet Paul',
      url: 'https://fullstackopen.com',
      user: firstUser._id,
      likes: 60,
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const blogAtEnd = await helper.blogsInDB()
    assert.strictEqual(blogAtEnd.length, blogsAtStart.length + 1)

    const title = blogAtEnd.map(blog => blog.title)
    assert(title.includes('My first blog.'))
  })

  test('login a user', async () => {
    await api
      .post('/api/login')
      .send({ username: 'root', password: 'secret123' })
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

})

after(async () => {
  mongoose.connection.close()
})