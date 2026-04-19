  const NewBlogForm = ({
    addNewBlog,
    setNewTitle,
    setNewAuthor,
    setNewUrl,
    newTitle,
    newAuthor,
    newUrl
  }) => {
    return (
    <form onSubmit={addNewBlog}>
      <h2>create new</h2>
      <div>
      <label>title:
      <input type='text' value={newTitle} onChange={({ target }) => setNewTitle(target.value)}/></label></div>
      <div>
      <label>author: 
      <input type='text' value={newAuthor} onChange={({ target }) => setNewAuthor(target.value)}/></label></div>
      <div>
      <label>url: 
      <input type='text' value={newUrl} onChange={({ target }) => setNewUrl(target.value)}/></label></div>
      <button type='submit'>create</button>
    </form>
  )
}


  export default NewBlogForm