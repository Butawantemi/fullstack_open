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
    <div style={blogStyle}>
      <p>
        {blog.title}
        <button onClick={() => setVisible(!visible)}>
          {visible ? 'hide' : 'view'}
        </button>
      </p>
      <div style={visible ? { display: '' } : { display: 'none' }}>
        <a href={blog.url}>{blog.url}</a>{' '}
        <p>
          likes {blog.likes}
          <button onClick={() => handleUpdateLike(blog)}>like</button>
        </p>
        {blog.author}
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
