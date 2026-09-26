import { Link } from 'react-router-dom'


const BlogList = ({ blogs }) => {


  return (<div>
    <h2>Blogs</h2>
    {/* {user && (
      <div>

        <Togglable buttonLabel="create new blog">
          <BlogForm
            createBlog={createBlog}
          />
        </Togglable>
      </div>
    )} */}
    <div>{blogs === null ? (
      <p>Loading blogs from database...</p>
    ) : (
      [...blogs]
        .sort((a, b) => b.likes - a.likes)
        .map((blog) => (<li key={blog.id}><Link to={`/blogs/${blog.id}`}>{blog.url}</Link></li>
        ))
    )}
    </div>
  </div> )
}

export default BlogList