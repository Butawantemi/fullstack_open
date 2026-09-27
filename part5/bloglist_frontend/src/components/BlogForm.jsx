import { TextField, Button, Box } from '@mui/material'
import { useState } from 'react'


const BlogForm = ({ createBlog }) => {

  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')

  const handleCreateBlog = (event) => {
    event.preventDefault()
    createBlog({
      title,
      author,
      url
    })

    setTitle('')
    setAuthor('')
    setUrl('')
  }

  return (
    <div>
      <h2>Create new</h2>
      <Box
        component="form"
        noValidate
        autoComplete="off"
        onSubmit={handleCreateBlog}
        sx={{
          maxWidth: '500px',
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
          mt: 2
        }}
      >
        <div>
          <TextField id="outlined-basic" label="Title" variant="outlined" type="text" value={title} onChange={({ target }) => setTitle(target.value)} inputProps={{ 'data-testid': 'title' }}
            fullWidth/>
        </div>
        <div>
          <TextField id="outlined-basic" label="Author" variant="outlined" type="text" value={author} onChange={({ target }) => setAuthor(target.value)} inputProps={{ 'data-testid': 'author' }}
            fullWidth/>
        </div>
        <div>
          <TextField id="outlined-basic" label="Url" variant="outlined" type="text" value={url} onChange={({ target }) => setUrl(target.value)} inputProps={{ 'data-testid': 'url' }} fullWidth/>
        </div>
        <Button variant="contained" type="submit" sx={{ alignSelf: 'flex-start', mt: 1 }}>create</Button>
      </Box>
    </div>
  )
}

export default BlogForm
