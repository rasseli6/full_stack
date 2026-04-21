const BlogView = ({ blog, user, updateLikes, removeBlog }) => {
  if (!blog) return null
  return(
    <div>
      <h2>{blog.author}: {blog.title} </h2>
      <a href={blog.url}>{blog.url}</a>
      <p>likes {blog.likes} {user && <button onClick={() => updateLikes(blog)}>like</button>}</p>
      <p>Added by {blog.user?.name}</p>
      {user && user.username === blog.user?.username && (
        <button onClick={() => removeBlog(blog)}>remove</button>
      )}
    </div>
  )
}
export default BlogView