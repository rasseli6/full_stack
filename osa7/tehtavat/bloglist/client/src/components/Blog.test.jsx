import { render, screen } from '@testing-library/react'
import { test, expect, vi } from 'vitest'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import BlogView from './BlogView'
import NewBlogForm from './NewBlogForm'

const blog = {
  title: 'Uusi testi',
  author: 'MainRasse',
  likes: 3,
  url: 'testimiehet.fi',
  user: { username: 'TestiRasse', name: 'Testi Rasse' }
}

test('kirjautumaton käyttäjä näkee tiedot mutta ei nappeja kai', () => {
  render(
    <MemoryRouter>
      <BlogView blog={blog} user={null} updateLikes={() => {}} removeBlog={() => {}} />
    </MemoryRouter>
  )
  expect(screen.getByText(/Uusi testi/)).toBeDefined()
  expect(screen.getByText(/3/)).toBeDefined()
  expect(screen.queryByText('like')).toBeNull()
  expect(screen.queryByText('remove')).toBeNull()
})

test('kirjautunut käyttäjä joka ei ole itse luoja näkee vain like nappulan', () => {
  render(
    <MemoryRouter>
      <BlogView blog={blog} user={{ username: 'jokuMuu' }} updateLikes={() => {}} removeBlog={() => {}} />
    </MemoryRouter>
  )
  expect(screen.queryByText('like')).not.toBeNull()
  expect(screen.queryByText('remove')).toBeNull()
})

test('blogin luoja näkee like ja remove napit', () => {
  render(
    <MemoryRouter>
      <BlogView blog={blog} user={{ username: 'TestiRasse' }} updateLikes={() => {}} removeBlog={() => {}} />
    </MemoryRouter>
  )
  expect(screen.queryByText('like')).not.toBeNull()
  expect(screen.queryByText('remove')).not.toBeNull()
})

test('<NewBlogForm/> suottapi olla että toimii tai ei toimi', async () => {
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
    url: 'testi.fi'
  })
})