import { Button, Card, CardContent, Typography } from '@mui/material'

const BlogView = ({ blog, user, updateLikes, removeBlog }) => {
  if (!blog) return null
  return (
    <Card style={{ marginTop: 20 }}>
      <CardContent>
        <Typography variant="h4" >{blog.title}</Typography>
        <Typography variant="subtitle1" color="text.secondary">by {blog.author}</Typography>
        <Typography>
          <a href={blog.url}>{blog.url}</a>
        </Typography>
        <Typography>Added by {blog.user?.name}</Typography>
        <Typography style={{ marginTop: 10 }}>
          {blog.likes} likes
          {user && <Button variant="outlined" style={{ marginLeft: 10 }} onClick={() => updateLikes(blog)}>like</Button>}
          {user && user.username === blog.user?.username && (
            <Button variant="outlined" color="error" style={{ marginLeft: 10 }} onClick={() => removeBlog(blog)}>remove</Button>
          )}
        </Typography>
      </CardContent>
    </Card>
  )
}

export default BlogView