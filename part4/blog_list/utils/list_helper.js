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

const mostBlogs = (blogs) => {
  if (blogs.length === 0) return null
  const authorCounts = blogs.reduce((counts, blog) => {
    counts[blog.author] = (counts[blog.author] || 0) + 1
    return counts
  }, {})

  const topAuthor = Object.keys(authorCounts).reduce((a, b) =>
    authorCounts[b] > authorCounts[a] ? b : a
  )

  return {
    author: topAuthor,
    blogs: authorCounts[topAuthor]
  }
}

const mostLikes = (blogs) => {
  if (blogs.length === 0) return null
  const maxLikes = Math.max(...blogs.map(blog => blog.likes))
  const mostLikesBlog = blogs.find(blog => blog.likes === maxLikes)
  return { author: mostLikesBlog.author, likes: mostLikesBlog.likes }
}

module.exports = {
  dummy, totalLikes, favoriteBlog, mostBlogs, mostLikes
}