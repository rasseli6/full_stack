import { TextField, Button } from '@mui/material'
import { useState } from 'react'

const NewBlogForm = ({ createBlog }) => {
  const [newTitle, setNewTitle] = useState('')
  const [newAuthor, setNewAuthor] = useState('')
  const [newUrl, setNewUrl] = useState('')

  const addBlog = event => {
    event.preventDefault()

    const blogObject = {
      title: newTitle,
      author: newAuthor,
      url: newUrl
    }

    createBlog(blogObject)

    setNewTitle('')
    setNewAuthor('')
    setNewUrl('')
  }

  return (
    <div>
      <h2>create new</h2>
      <form onSubmit={addBlog}>
        <div>
          <TextField label="title" value={newTitle} onChange={({ target }) => setNewTitle(target.value)} />
        </div>
        <div>
          <TextField label="author" value={newAuthor} onChange={({ target }) => setNewAuthor(target.value)} />
        </div>
        <div>
          <TextField label="url" value={newUrl} onChange={({ target }) => setNewUrl(target.value)} />
        </div>
        <Button type="submit" variant="contained" style={{ marginTop: 10 }}>create</Button>
      </form>
    </div>
  )
}

export default NewBlogForm