import { useNavigate } from 'react-router-dom'

const Blog = ({ blog, handleUpdateLike, removeBlog, user }) => {
  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
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
    <div style={blogStyle} data-testid='blog'>
      <h2>{blog.author} {blog.title}</h2>
      <a href={blog.url}>{blog.url}</a>{' '}
      <p>
          likes {blog.likes}
        {user && (<button onClick={() => handleUpdateLike(blog)} >like</button>)}
      </p>
      <p>Added by <strong>{blog.user.username}</strong></p>
      {showRemoveButton && (<button
        onClick={() => handleRemoveBlog(blog)}
      >
        remove
      </button>)}
    </div>

  )
}

export default Blog
