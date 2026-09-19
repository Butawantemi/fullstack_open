const mongoose = require('mongoose')
const User = require('./models/user')
const Blog = require('./models/blogs')
const config = require('./utils/config')
const logger = require('./utils/logger')

const resetDatabase = async () => {
  await mongoose.connect(config.MONGODB_URI)

  await User.deleteMany({})
  await Blog.deleteMany({})

  logger.info('Database wiped completely clean!')
  mongoose.connection.close()
}

resetDatabase()