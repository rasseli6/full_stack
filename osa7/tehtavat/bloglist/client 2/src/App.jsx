import { useState, useEffect } from 'react'
import blogService from './services/blogs'
import loginService from './services/login'
import Notification from './components/Notifications'
import NewBlogForm from './components/NewBlogForm'
import { Link, Route, Routes, useNavigate, useMatch } from 'react-router-dom'
import BlogView from './components/BlogView'
import { useNotificationActions } from './stores/notificationStore'
import { useBlogs, useBlogActions } from './stores/blogStore'
import { AppBar, Toolbar, Typography, Button as MuiButton, TextField, Button } from '@mui/material'
import ErrorBoundary from './components/ErrorBoundary'
import NotFound from './components/NotFound'

const App = () => {
  const blogs = useBlogs()
  const { initializeBlogs, createBlog, likeBlog, deleteBlog } = useBlogActions()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const { setNotification } = useNotificationActions()

  const navigate = useNavigate()
  const match = useMatch('/blogs/:id')
  const blog = match ? blogs.find((b) => b.id === match.params.id) : null

  const removeBlog = async (blog) => {
    const vahvistus = window.confirm('Are you sure you want to permanently delete this blog?')
    if (!vahvistus) {
      return
    } else {
      await deleteBlog(blog.id)
    }
  }

  const updateLikes = async (blog) => {
    await likeBlog(blog)
  }

  useEffect(() => {
    initializeBlogs()
  }, [initializeBlogs])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const handleLogin = async (event) => {
    event.preventDefault()

    try {
      const user = await loginService.login({ username, password })
      window.localStorage.setItem('loggedBlogappUser', JSON.stringify(user))
      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
      navigate('/')
    } catch {
      setNotification('wrong username or password')
    }
  }
  const handleLogout = () => {
    window.localStorage.removeItem('loggedBlogappUser')
    blogService.setToken(null)
    setUser(null)
  }

  const loginForm = () => {
    return (
      <div>
        <h2>Log in to application</h2>
        <form onSubmit={handleLogin}>
          <div>
            <TextField
              label="username"
              value={username}
              onChange={({ target }) => setUsername(target.value)}
            />
          </div>
          <div>
            <TextField
              label="password"
              type="password"
              value={password}
              onChange={({ target }) => setPassword(target.value)}
            />
          </div>
          <Button type="submit" variant="contained" style={{ marginTop: 10 }}>
            login
          </Button>
        </form>
      </div>
    )
  }
  const addNewBlog = async (blogObject) => {
    try {
      const returnedBlog = await createBlog(blogObject, user)
      setNotification(`a new blog ${returnedBlog.title} added!`)
      navigate('/')
    } catch {
      setNotification('Something went wrong. Try again')
    }
  }

  const sortedBlogs = [...blogs].sort((a, b) => b.likes - a.likes)

  return (
    <div>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" style={{ flexGrow: 1 }}>
            Blog App
          </Typography>
          <MuiButton color="inherit" component={Link} to="/">
            blogs
          </MuiButton>
          {user && (
            <MuiButton color="inherit" component={Link} to="/create">
              new blog
            </MuiButton>
          )}
          {user ? (
            <MuiButton color="inherit" onClick={handleLogout}>
              logout
            </MuiButton>
          ) : (
            <MuiButton color="inherit" component={Link} to="/login">
              login
            </MuiButton>
          )}
        </Toolbar>
      </AppBar>

      <Notification />
      <ErrorBoundary>
        <Routes>
          <Route
            path="/create"
            element={
              <div>
                <NewBlogForm createBlog={addNewBlog} />
              </div>
            }
          />
          <Route path="/login" element={loginForm()} />
          <Route
            path="/blogs/:id"
            element={
              <BlogView blog={blog} user={user} updateLikes={updateLikes} removeBlog={removeBlog} />
            }
          />
          <Route
            path="/"
            element={
              user && (
                <div>
                  <h2>blogs</h2>
                  <ul>
                    {sortedBlogs.map((blog) => (
                      <li key={blog.id}>
                        <Link to={`/blogs/${blog.id}`}>
                          {blog.title} by {blog.author}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )
            }
          />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </ErrorBoundary>
    </div>
  )
}
export default App
