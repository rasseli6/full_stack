const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => { 
    return blogs.reduce((sum, blog) => {
        return sum + blog.likes;
}, 0);}

const favoriteBlog = (blogs) => {
  if (blogs.length === 0) return null;
  return blogs.reduce((best, liked) => {
    return (best.likes > liked.likes) ? best : liked;
  })
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog
}

