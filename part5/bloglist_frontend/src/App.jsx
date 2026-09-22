import { useEffect, useState } from 'react'
import loginService from './services/login'
import userService from './services/user'
import blogsService from './services/blogs'
import Blog from './components/Blog'
import LoginForm from './components/LoginForm'
import BlogForm from './components/BlogForm'
import Notification from './components/Notification'
import Togglable from './components/Togglable'

const App = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')
  const [user, setUser] = useState(null)
  const [blogs, setBlogs] = useState(null)

  const [notificationMessage, setNotificationMessage] = useState(null)
  const [notificationType, setNotificationType] = useState('success')

  const notify = (message, type = 'success') => {
    setNotificationMessage(message)
    setNotificationType(type)
    setTimeout(() => {
      setNotificationMessage(null)
    }, 5000)
  }

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const parsedUser = JSON.parse(loggedUserJSON)
      const initializeData = async () => {
        try {
          const allUsers = await userService.getAllUsers()
          const matchedUser = allUsers.find(
            (u) => u.username === parsedUser.username,
          )

          setUser(parsedUser)
          blogsService.setToken(parsedUser.token)
          if (matchedUser) {
            setBlogs(matchedUser.blogs)
          } else {
            setBlogs([])
          }
        } catch (error) {
          console.error('Failed to restore session on page refresh:', error)
          window.localStorage.removeItem('loggedBlogappUser')
          setUser(null)
          setBlogs([])
        }
      }
      initializeData()
    }
  }, [])

  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      const loggedUser = await loginService.login({ username, password })
      const allUsers = await userService.getAllUsers()
      const matchedUser = allUsers.find(
        (u) => u.username === loggedUser.username,
      )

      window.localStorage.setItem(
        'loggedBlogappUser',
        JSON.stringify(loggedUser),
      )
      blogsService.setToken(loggedUser.token)

      setUser(loggedUser)
      if (matchedUser) {
        setBlogs(matchedUser.blogs)
      } else {
        setBlogs([])
      }

      setUsername('')
      setPassword('')
      notify(`Welcome back, ${loggedUser.name}!`)
    } catch (error) {
      console.error('Login failed:', error)
      notify('Wrong username or password', 'error')
    }
  }

  const handleCreateBlog = async (event) => {
    event.preventDefault()
    try {
      const returnedBlog = await blogsService.createblog({
        title,
        author,
        url,
      })
      setBlogs(blogs.concat(returnedBlog))

      notify(`A new blog "${title}" by ${author} was successfully added!`)

      setTitle('')
      setAuthor('')
      setUrl('')
    } catch (error) {
      console.error('Failed to create blog post:', error)
      notify('Failed to create blog post. Check your data inputs.', 'error')
    }
  }

  const handleUpdateLike = async (blog) => {
    try {
      const updateBlog = {
        author: blog.author,
        url: blog.url,
        likes: blog.likes + 1,
        title: blog.title,
      }
      const updatedBlog = await blogsService.updateblog(updateBlog, blog.id)
      setBlogs(blogs.map((b) => (b.id === updatedBlog.id ? updatedBlog : b)))
    } catch (error) {
      console.error('Failed to update blog post:', error)
      notify('Failed to update blog post.', 'error')
    }
  }

  const handleRemoveBlog = async (blog) => {
    if (
      window.confirm(`Remove blog You're NOT gonna need it! by ${blog.author}?`)
    ) {
      try {
        await blogsService.deleteBlog(blog.id)
        setBlogs(blogs.filter((b) => b.id !== blog.id))
      } catch (error) {
        console.error('Failed to delete blog post:', error)
        notify('Failed to delete blog post.', 'error')
      }
    }
  }

  const handleLogout = (event) => {
    event.preventDefault()
    window.localStorage.removeItem('loggedBlogappUser')
    setUser(null)
    setBlogs(null)
    notify('Logged out successfully')
  }

  return (
    <div>
      <h1>Blog Application</h1>

      <Notification message={notificationMessage} type={notificationType} />

      {!user && (
        <LoginForm
          handleSubmit={handleLogin}
          username={username}
          password={password}
          handleUsernameChange={({ target }) => setUsername(target.value)}
          handlePasswordChange={({ target }) => setPassword(target.value)}
        />
      )}

      {user && (
        <div>
          <p>
            {user.name} logged in <button onClick={handleLogout}>logout</button>
          </p>

          <Togglable buttonLabel="create new blog">
            <BlogForm
              handleSubmit={handleCreateBlog}
              title={title}
              author={author}
              url={url}
              handleTitleChange={({ target }) => setTitle(target.value)}
              handleAuthorChange={({ target }) => setAuthor(target.value)}
              handleUrlChange={({ target }) => setUrl(target.value)}
            />
          </Togglable>
          <br />

          {blogs === null ? (
            <p>Loading blogs from database...</p>
          ) : (
            [...blogs]
              .sort((a, b) => b.likes - a.likes)
              .map((blog) => (
                <Blog
                  key={blog.id}
                  blog={blog}
                  handleUpdateLike={handleUpdateLike}
                  handleRemoveBlog={handleRemoveBlog}
                  user={user}
                />
              ))
          )}
        </div>
      )}
    </div>
  )
}

export default App
