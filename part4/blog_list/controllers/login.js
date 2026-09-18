const loginRouter = require('express').Router()
const User = require('../models/user')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')


loginRouter.post('/', async (request, response) => {
  const { username, password } = request.body

  if (!username || !password) {
    return response.status(400).json({ error: 'Both field required' })
  }

  const user = await User.findOne({ username })

  const correctPassword = user === null ? false : bcrypt.compare(password, user.passwordHash)

  if (!user || !correctPassword) {
    return response.status(401).json({ error: 'Wrong username or password!' })
  }

  const userForUser = {
    username: user.username,
    id: user._d
  }

  const token = jwt.sign(userForUser, process.env.SECRET)
  response.status(200).json({ token: token, username: user.username, name:user.name })
})


module.exports = loginRouter