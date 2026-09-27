import { Card, CardContent, Typography, Button } from '@mui/material'
import { useNavigate } from 'react-router-dom'


const Blog = ({ blog, handleUpdateLike, removeBlog, user }) => {
  const blogStyle = {
    marginTop: 5,
    padding: 5,
    borderWidth: 1,
    marginBottom: 5,
  }

  const navigate = useNavigate()

  if (!blog) {
    return null
  }

  const handleRemoveBlog = () => {
    removeBlog(blog)
    navigate('/')
  }

  const loggedInUserId = user?.id || user?._id

  const blogCreatorId = blog.user?.id || blog.user?._id || blog.user

  const showRemoveButton = loggedInUserId && blogCreatorId && loggedInUserId === blogCreatorId


  return (
    <Card sx={blogStyle} data-testid='blog'>
      <CardContent>
        <Typography variant='h4'>{blog.title}</Typography>
        <Typography variant='h6'>by {blog.author}</Typography>
        <Typography variant='h6' color="inherit"><a href={blog.url}>{blog.url}</a></Typography>
        <Typography variant='h6'>Added by {blog.user?.username}</Typography>
        <Typography variant='h6'>{blog.likes} likes
          {user && (<Button sx={{ margin: 2 }} variant="outlined" onClick={() => handleUpdateLike(blog)} >like</Button>)}
          {showRemoveButton && (<Button variant="outlined" color="error"
            onClick={() => handleRemoveBlog(blog)}
          >
        remove
          </Button>)}</Typography>
      </CardContent>
    </Card>

  )
}

export default Blog
