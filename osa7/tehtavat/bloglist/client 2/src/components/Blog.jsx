import { useState } from 'react'

const Blog = ({ blog, updateLikes, user, removeBlog }) => {
  const [visible, setVisible] = useState(false)

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 5,
    border: 'solid',
    borderWidth: 2,
    marginBottom: 5
  }

  if (visible === false) {
    return (
      <div style={blogStyle}>
        {' '}
        {blog.title} {blog.author}
        <button onClick={() => setVisible(true)}>view</button>
      </div>
    )
  } else {
    return (
      <div style={blogStyle}>
        <p>
          {blog.title} {blog.author}
          <button onClick={() => setVisible(false)}>hide</button>
        </p>
        <p>{blog.url} </p>
        <p>
          {blog.likes} <button onClick={() => updateLikes(blog)}>like</button>
        </p>
        <p>{blog.user?.name}</p>
        {user.username === blog.user?.username && (
          <button onClick={() => removeBlog(blog)}>remove</button>
        )}
      </div>
    )
  }
}

export default Blog
