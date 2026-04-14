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

const mostBlogs = (blogs) => {
  if ( blogs.length === 0 ) return null;
  const counts = blogs.reduce((dict, blog) =>  {
    dict[blog.author] = (dict[blog.author] || 0 ) + 1
    return dict
  }, {});
  const enitenKirjoittanut = Object.keys(counts).reduce((eniten, nykyinen) => {
    return (counts[eniten] > counts[nykyinen]) ? eniten : nykyinen;
  });
  return {
    'author': enitenKirjoittanut,
    'blogs': counts[enitenKirjoittanut]
  }
}

const mostLikes = (blogs) => {
  if ( blogs.length === 0 ) return null;
  const counts = blogs.reduce((dict, blog) =>  {
    dict[blog.author] = (dict[blog.author] || 0 ) + blog.likes
    return dict
  }, {});
  const enitenTykätty = Object.keys(counts).reduce((eniten, nykyinen) => {
    return (counts[eniten] > counts[nykyinen]) ? eniten : nykyinen;
  });
  return {
    'author': enitenTykätty,
    'likes': counts[enitenTykätty]
  }
}


module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes
}

