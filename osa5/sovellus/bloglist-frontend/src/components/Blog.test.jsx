import { render, screen } from '@testing-library/react'
import { test, expect, vi } from 'vitest'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'
import NewBlogForm from './NewBlogForm'

const blog = { title: 'Uusi testi', author: 'MainRasse', likes: 3, url: 'testimiehet.fi', 
        user: { username: 'TestiRasse', name: 'Testi Rasse'}}


test('render komponentti', () => {
    render(<Blog blog={blog} updateLikes={() => {}} removeBlog={() => {}} user={{ username: 'TestiRasse' }} />)
    screen.getByText(/Uusi testi/)
    screen.getByText(/MainRasse/)
    expect(screen.queryByText('testi.fi')).toBeNull()
    expect(screen.queryByText('3')).toBeNull()})

test('nappia painamalla url ja liket', async () => {
    render(<Blog blog={ blog } updatedLikes= {() => {} } removeBlog = { () => {} }
    user={{ username: 'TestiRasse'}} />)
    const user = userEvent.setup()
    await user.click(screen.getByText(/view/))
    
    expect(screen.queryByText(/testimiehet\.fi/)).not.toBeNull()
    expect(screen.queryByText(/3/)).not.toBeNull()
})

test('tupla likellä kutsutaan myös kaksi kertaa', async () => {
    const updatelikes = vi.fn()
    render(<Blog blog={blog} updateLikes={updatelikes} removeBlog={() => {}} user={{ username: 'TestiRasse' }} />)
    const user = userEvent.setup()
    await user.click(screen.getByText(/view/))
    const likeButton = screen.getByText(/like/)
    await user.click(likeButton)
    await user.click(likeButton)
    expect(updatelikes).toHaveBeenCalledTimes(2)
})

test('<NewBlogForm/> toimii tai ei toimi', async () => {
    const user = userEvent.setup()
    const createBlog = vi.fn()
    render(<NewBlogForm createBlog={createBlog} />)
    await user.type(screen.getByLabelText(/title/), 'Testi title')
    await user.type(screen.getByLabelText(/author/), 'Testi author')
    await user.type(screen.getByLabelText(/url/), 'testi.fi')
    await user.click(screen.getByText('create'))
    expect(createBlog).toHaveBeenCalledTimes(1)
    expect(createBlog).toHaveBeenCalledWith({
        title: 'Testi title',
        author: 'Testi author',
        url: 'testi.fi'})
})