import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'
import Notification from './components/Notifications'
import NewBlogForm from './components/NewBlogForm'


const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)
  const [newTitle, setNewTitle] = useState('')
  const [newAuthor, setNewAuthor] = useState('')
  const [newUrl, setNewUrl] = useState('')
  const [blogFormVisible, setBlogFormVisible] = useState(false)


  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs )
    )  
  }, [])

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
 
  const addNewBlog = async event => {
    event.preventDefault()
    try {
      const blogObject = {
        title: newTitle,
        author: newAuthor, 
        url: newUrl
      }
      const returnedBlog = await blogService.create(blogObject)
        setBlogs(blogs.concat(returnedBlog))
        setNewTitle('')
        setNewAuthor('')
        setNewUrl('')
        setErrorMessage(`a new blog ${returnedBlog.title} added!`)
        setBlogFormVisible(false)
        setTimeout(()=>{
          setErrorMessage(null)
        }, 5000)
      }catch {
        setErrorMessage('Something went wrong. Try again')
        setTimeout(() => {
          setErrorMessage(null)
        }, 5000)
      }
  }
  const hideWhenVisible = { display: blogFormVisible ? 'none' : '' }
  const showWhenVisible = { display: blogFormVisible ? '' : 'none' }

  return (
    <div>
      <Notification message={errorMessage}/>
      {!user && loginForm()}
      {user && (
        <div>
          <h2>blogs</h2>
          <p>
            {user.name} logged in <button onClick={handleLogout}>logout</button>
          </p>
          
          <div style ={hideWhenVisible}>
            <button onClick={() => setBlogFormVisible(true)}>create new blog</button>  
          </div>
          
          <div style={showWhenVisible}>
            <NewBlogForm
                addNewBlog={addNewBlog}
                setNewTitle={setNewTitle}
                setNewAuthor={setNewAuthor}
                setNewUrl={setNewUrl}
                newTitle={newTitle}
                newAuthor={newAuthor}
                newUrl={newUrl}
              />
            <button type='button' onClick={() => setBlogFormVisible(false)}>
            cancel 
            </button>
          </div>
          
          {blogs.map(blog => 
            <Blog key={blog.id} blog={blog} />
          )}
        </div>
    )}
    </div>
)
}

export default App