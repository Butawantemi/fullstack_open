import { Button, Card, CardContent, Typography } from '@mui/material'
import { Link } from 'react-router-dom'



const BlogList = ({ blogs }) => {

  const blogStyle = {
    marginTop: 5,
    padding: 5,
    marginBottom: 5,
    border: 'none'
  }

  // <Link to={`/blogs/${blog.id}`}>{blog.url}</Link>

  return (<Card sx={blogStyle}>
    <Typography variant='h4'>Blogs</Typography>
    <CardContent>{blogs === null ? (
      <Typography variant='h6'>Loading blogs from database...</Typography>
    ) : (
      [...blogs]
        .sort((a, b) => b.likes - a.likes)
        .map((blog) => (<Typography key={blog.id}><Link to={`/blogs/${blog.id}`}>{blog.url}</Link></Typography>
        ))
    )}
    </CardContent>
  </Card> )
}

export default BlogList