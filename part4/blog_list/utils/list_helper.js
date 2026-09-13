const dummy = (blogs) => {
  return 1
}

const totalLikes = (listWithOneBlog) => {
  return listWithOneBlog[0].likes
}

const favoriteBlog = (blogs) => {
  if(blogs.length === 0) return null
  const maxLikes = Math.max(...blogs.map(blog => blog.likes))
  return blogs.find(blog => blog.likes === maxLikes)
}

module.exports = {
  dummy, totalLikes, favoriteBlog
}