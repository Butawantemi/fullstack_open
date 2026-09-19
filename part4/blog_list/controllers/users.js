const usersRouter = require('express').Router()
const bcrypt = require('bcrypt')
const User = require('../models/user')

usersRouter.get('/', async (request, response) => {
  const user = await User.find({}).populate('blogs')
  response.status(200).json(user)
})

usersRouter.post('/', async (request, response) => {
  const { username, name, password } = request.body

  if (!(username && password)) {
    return response.status(400).json({ error: 'Username and Password are required' })
  }

  if (username.length < 3) {
    response.status(400).json({ error: 'Username must be at least 3 characters long.' })
  }

  if (password.length < 3) {
    response.status(400).json({ error: 'Password must be at least 3 characters long' })
  }
  const saltRounds = 10
  const passwordHash = await bcrypt.hash(password, saltRounds)

  const user = new User({
    username,
    name,
    passwordHash
  })

  const savedUser = await user.save()
  response.status(201).json(savedUser)
})

module.exports = usersRouter