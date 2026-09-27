import { useEffect, useState } from 'react'
import { Routes, Route, Link, useMatch, useNavigate } from 'react-router-dom'
import loginService from './services/login'
import blogsService from './services/blogs'
import LoginForm from './components/LoginForm'
import BlogForm from './components/BlogForm'
import BlogList from './components/BlogList'
import Blog from './components/Blog'
import Notification from './components/Notification'
import { Box, AppBar, Button, Toolbar, Typography } from '@mui/material'



const App = () => {
  const [blogs, setBlogs] = useState(null)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)

  const [notificationMessage, setNotificationMessage] = useState(null)
  const [notificationType, setNotificationType] = useState('success')

  const navigate = useNavigate()

  const notify = (message, type = 'success') => {
    setNotificationMessage(message)
    setNotificationType(type)
    setTimeout(() => {
      setNotificationMessage(null)
    }, 5000)
  }

  useEffect(() => {
    const getAllBlogs = async () => {
      try {
        const allBlogs = await blogsService.getAllBlogs()
        setBlogs(allBlogs)
      } catch (error) {
        setBlogs(null)
        console.log(error)
      }
    }
    getAllBlogs()
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const parsedUser = JSON.parse(loggedUserJSON)
      const initializeData = async () => {
        try {
          blogsService.setToken(parsedUser.token)
          setUser(parsedUser)
        } catch (error) {
          console.error('Failed to restore session on page refresh:', error)
          window.localStorage.removeItem('loggedBlogappUser')
          setUser(null)
        }
      }
      initializeData()
    }
  }, [])


  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      const loggedUser = await loginService.login({ username, password })
      setUser(loggedUser)
      window.localStorage.setItem(
        'loggedBlogappUser',
        JSON.stringify(loggedUser),
      )
      blogsService.setToken(loggedUser.token)
      setUser(loggedUser)
      setUsername('')
      setPassword('')
      notify(`Welcome back, ${loggedUser.name}!`)
      navigate('/')
    } catch (error) {
      console.error('Login failed:', error)
      notify('Wrong username or password', 'error')
    }
  }

  const createBlog = async (blogObject) => {
    try {
      const returnedBlog = await blogsService.createblog(blogObject)

      setBlogs(blogs.concat(returnedBlog))

      notify(`A new blog "${returnedBlog.title}" by ${returnedBlog.author} was successfully added!`)
      navigate('/')
    } catch (error) {
      console.error('Failed to create blog post:', error)
      notify('Failed to create blog post. Check your data inputs.', 'error')
    }
  }

  const handleUpdateLike = async (blog) => {
    try {
      const updateBlog = {
        likes: blog.likes + 1
      }
      const updatedBlog = await blogsService.updateblog(updateBlog, blog.id)
      setBlogs(blogs.map((b) => (b.id === updatedBlog.id ? updatedBlog : b)))
    } catch (error) {
      console.error('Failed to update blog post:', error)
      notify('Failed to update blog post.', 'error')
    }
  }

  const removeBlog = async (blog) => {
    if (
      window.confirm(`Remove blog You're NOT gonna need it! by ${blog.author}?`)
    ) {
      try {
        await blogsService.deleteBlog(blog.id)
        setBlogs(blogs.filter((b) => b.id !== blog.id))
        notify('Successfully delete blog post.', 'success')
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
    navigate('/')
    notify('Logged out successfully')
  }

  const match = useMatch('/blogs/:id')

  const blog = (match && blogs) ? blogs.find(b => b.id === match.params.id) : null

  const style = { '&:hover': { bgcolor: 'rgba(255,255,255,0.3)' } }

  return (
    <div>
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position='static' component='nav'>
          <Toolbar>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              <Link style={{ textDecoration: 'none', color: 'whitesmoke' }} to='/'>Blog App</Link>
            </Typography>
            <Button color="inherit" component={Link} to="/" sx={style}>Blogs</Button>
            {!user && <Button color="inherit" component={Link} to="/login" sx={style}>Login</Button>}
            {user && <span><Button color="inherit" component={Link} to="/create" sx={style}>new blog</Button><Button color="inherit" onClick={handleLogout} sx={style}>logout</Button></span>}
          </Toolbar>
        </AppBar>
      </Box>
      <Notification message={notificationMessage} type={notificationType} />
      <Routes>
        <Route path='/' element={<BlogList blogs={blogs} user={user} />} />
        <Route path='/blogs/:id' element={<Blog blog={blog} removeBlog={removeBlog} handleUpdateLike={handleUpdateLike} user={user}/>} />
        <Route path='/create' element={<BlogForm createBlog={ createBlog} />} />
        <Route path="/login" element={<LoginForm
          handleSubmit={handleLogin}
          username={username}
          password={password}
          handleUsernameChange={({ target }) => setUsername(target.value)}
          handlePasswordChange={({ target }) => setPassword(target.value)}
        />} />
      </Routes>
    </div>
  )
}

export default App
