import { useState } from 'react'

const Blog = ({ blog, handleUpdateLike, handleRemoveBlog, user }) => {
  const [visible, setVisible] = useState(false)
  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5,
  }

  return (
    <div style={blogStyle} data-testid='blog'>
      <p data-testid="firstToshow">
        <span> {blog.title}</span>  <span>{blog.author}</span>
        <button onClick={() => setVisible(!visible)}>
          {visible ? 'hide' : 'view'}
        </button>
      </p>
      <div style={visible ? { display: '' } : { display: 'none' }} data-testid="toggleContent">
        <a href={blog.url}>{blog.url}</a>{' '}
        <p>
          likes {blog.likes}
          <button onClick={() => handleUpdateLike(blog)} >like</button>
        </p>
        <p><strong>{user.username}</strong></p>
        {user && (
          <button
            style={{ background: 'blue', marginBottom: 5 }}
            onClick={() => handleRemoveBlog(blog)}
          >
            remove
          </button>
        )}
      </div>
    </div>
  )
}

export default Blog
