import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'
import Notification from './components/Notifications'
import NewBlogForm from './components/NewBlogForm'
import { Link, Route, Routes, useNavigate, useMatch } from 'react-router-dom'
import BlogView from './components/BlogView'


const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)
  const [blogFormVisible, setBlogFormVisible] = useState(false)

  const navigate = useNavigate()
  const match = useMatch('/blogs/:id')
  const blog = match ? blogs.find(b => b.id === match.params.id) : null

  const removeBlog = async blog => {
    const vahvistus = window.confirm('Are you sure you want to permanently delete this blog?')
    if (!vahvistus) {
      return} else {
      await blogService.remove(blog.id)
      setBlogs(blogs.filter(b => b.id !== blog.id))
    }
  }

  const updateLikes = async blog => {
    const updatedBlog = {
      ...blog,
      likes: blog.likes + 1,
      user: blog.user.id
    }
    const returnedBlog = await blogService.update(blog.id, updatedBlog)
    setBlogs(blogs.map(b => b.id !== blog.id ? b : { ...returnedBlog, user: blog.user }))
  }

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs )
    )}, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const handleLogin = async event => {
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
      setErrorMessage('wrong username or password')
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }
  const handleLogout = () => {
    window.localStorage.removeItem('loggedBlogappUser')
    blogService.setToken(null)
    setUser(null)
  }

  const loginForm = () => (
    <form onSubmit={handleLogin}>
      <div>
        <h2>login</h2>
        <label>
          username
          <input
            type="text"
            value={username}
            onChange={({ target }) => setUsername(target.value)}
          />
        </label>
      </div>
      <div>
        <label>
          password
          <input
            type="password"
            value={password}
            onChange={({ target }) => setPassword(target.value)}
          />
        </label>
      </div>
      <button type="submit">login</button>
    </form>
  )
  const addNewBlog = async blogObject => {
    try{
      const returnedBlog = await blogService.create(blogObject)
      setBlogs(blogs.concat({ ...returnedBlog, user: user }))
      setErrorMessage(`a new blog ${returnedBlog.title} added!`)
      navigate('/')
      setTimeout(() => { setErrorMessage(null)
      }, 5000)
    } catch {
      setErrorMessage('Something went wrong. Try again')
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }
  const hideWhenVisible = { display: blogFormVisible ? 'none' : '' }
  const showWhenVisible = { display: blogFormVisible ? '' : 'none' }
  const sortedBlogs = [...blogs].sort((a,b) => b.likes - a.likes)
  const padding = { padding: 5 }
  return (
    <div>
      <div>
        <Link style={padding} to="/">blogs</Link>
        {user
          ? <><Link style={padding} to="/create">New Blog</Link><button onClick={handleLogout}>logout</button></>
          : <Link style={padding} to="/login">login</Link>
        }
      </div>

      <Notification message={errorMessage}/>

      <Routes>
        <Route path="/create" element={
          <div>
            <NewBlogForm createBlog={addNewBlog}/>
          </div>
        }/>
        <Route path="/login" element={loginForm()} />
        <Route path="/blogs/:id" element={<BlogView blog={blog} user={user} updateLikes={updateLikes} removeBlog={removeBlog} />} />
        <Route path="/" element={
          user && (
            <div>
              <h2>blogs</h2>
              <p>{user.name} logged in</p>
              <div style={hideWhenVisible}>
                <button onClick={() => setBlogFormVisible(true)}>create new blog</button>
              </div>
              <div style={showWhenVisible}>
                <NewBlogForm createBlog={addNewBlog}/>
                <button type='button' onClick={() => setBlogFormVisible(false)}>cancel</button>
              </div>
              <ul>
                {sortedBlogs.map(blog =>
                  <li key={blog.id}>
                    <Link to={`/blogs/${blog.id}`}>{blog.title} by {blog.author}</Link>
                  </li>
                )}
              </ul>
            </div>
          )} />
      </Routes>
    </div>)}
export default App