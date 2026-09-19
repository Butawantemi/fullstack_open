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


let tokenHeader = null
let mainTestUser = null

beforeEach(async () => {
  await Blog.deleteMany({})
  await User.deleteMany({})

  const passwordHash = await bcrypt.hash('secret123', 10)
  mainTestUser = new User({
    username: 'root',
    name: 'Super User',
    passwordHash
  })
  await mainTestUser.save()

  const loginResponse = await api
    .post('/api/login')
    .send({ username: 'root', password: 'secret123' })
  tokenHeader = `Bearer ${loginResponse.body.token}`

  const initialBlogsRaw = await helper.blogsAtStart(mainTestUser._id)

  const blogObjects = initialBlogsRaw.map(blog => new Blog(blog))
  const promiseArray = blogObjects.map(blog => blog.save())
  await Promise.all(promiseArray)
})

describe('Fetching blogs', () => {
  test('return the correct amount of blog posts in json format', async () => {
    const initialBlogsRaw = await helper.blogsAtStart(mainTestUser._id)

    const response = await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)

    assert.strictEqual(response.body.length, initialBlogsRaw.length)
  })

  test('blog posts have a unique identifier property named id', async () => {
    const response = await api.get('/api/blogs').expect(200)
    const blogs = response.body
    assert.notStrictEqual(blogs.length, 0)

    const firstBlog = blogs[0]
    assert.notStrictEqual(firstBlog.id, undefined)
    assert.strictEqual(firstBlog._id, undefined)
  })
})


describe('Adding new blogs', () => {
  test('create a post and verify that the content is saved correctly', async () => {
    const initialBlogsRaw = await helper.blogsAtStart(mainTestUser._id)
    const newBlog = {
      title: 'My first blog.',
      author: 'Japhet Paul',
      url: 'https://fullstackopen.com',
      likes: 60,
    }

    await api
      .post('/api/blogs')
      .set('Authorization', tokenHeader)
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const blogAtEnd = await helper.blogsInDB()
    assert.strictEqual(blogAtEnd.length, initialBlogsRaw.length + 1)

    const titles = blogAtEnd.map(blog => blog.title)
    assert(titles.includes('My first blog.'))
  })

  test('if the likes property is missing, it defaults to 0', async () => {

    const newBlogWithoutLikes = {
      title: 'New blog post without likes',
      author: 'Japhet Paul',
      url: 'https://fullstackopen.com',
    }

    const response = await api
      .post('/api/blogs')
      .set('Authorization', tokenHeader)
      .send(newBlogWithoutLikes)
      .expect(201)

    assert.strictEqual(response.body.likes, 0)
  })


  test('backend responds with 400 Bad Request if title is missing', async () => {
    const blogWithoutTitle = {
      author: 'Japhet Paul',
      url: 'https://fullstackopen.com',
    }

    await api
      .post('/api/blogs')
      .set('Authorization', tokenHeader)
      .send(blogWithoutTitle)
      .expect(400)
  })

  test('backend responds with 400 Bad Request if url is missing', async () => {
    const blogWithoutUrl = {
      title: 'New blog post without likes',
      author: 'Japhet Paul'
    }

    await api
      .post('/api/blogs')
      .set('Authorization', tokenHeader)
      .send(blogWithoutUrl)
      .expect(400)
  })
})




describe('Modifying existing blogs', () => {
  test('succeeds with status code 204 if deletion is executed by the creator', async () => {
    const blogAtStart = await helper.blogsInDB()
    const blogToDelete = blogAtStart[0]

    await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .set('Authorization', tokenHeader)
      .expect(204)

    const blogAtEnd = await helper.blogsInDB()
    const ids = blogAtEnd.map(blog => blog.id)
    assert(!ids.includes(blogToDelete.id))
    assert.strictEqual(blogAtEnd.length, blogAtStart.length - 1)
  })

  test('succeeds updating a blog post with status code 200 if parameters match creator', async () => {
    const blogsBeforeUpdate = await helper.blogsInDB()
    const blogToUpdate = blogsBeforeUpdate[0]

    const blogUpdate = {
      title: 'Test use super test.',
      author: blogToUpdate.author,
      url: 'https://fullstackopen.com/en/part4',
      likes: 100
    }

    await api
      .put(`/api/blogs/${blogToUpdate.id}`)
      .set('Authorization', tokenHeader)
      .send(blogUpdate)
      .expect(200)

    const blogsAfterUpdate = await helper.blogsInDB()
    const updatedBlogInDb = blogsAfterUpdate.find(blog => blog.id === blogToUpdate.id)
    assert.strictEqual(updatedBlogInDb.title, blogUpdate.title)
    assert.strictEqual(updatedBlogInDb.likes, blogUpdate.likes)
  })
})

describe('User Management System Checks', () => {

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

  test('creation fails with status code 400 if username is already taken', async () => {
    const duplicateUser = {
      username: 'root',
      name: 'Another Root Account',
      password: 'differentPassword123'
    }

    await api
      .post('/api/users')
      .send(duplicateUser)
      .expect(400)
  })
})

after(async () => {
  mongoose.connection.close()
})