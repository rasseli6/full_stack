import { render, screen } from '@testing-library/react'
import { test, expect } from 'vitest'
import Blog from './Blog'


test('render komponentti', () => {const blog = { title: 'Uusin testi', author: 'MainRasse', likes: 3, url: 'testi.fi', 
  user: { username: 'TestiRasse', name: 'Testi Rasse' } }
render(<Blog blog={blog} updateLikes={() => {}} removeBlog={() => {}} user={{ username: 'TestiRasse' }} />)
screen.getByText(/Uusin testi/)
screen.getByText(/MainRasse/)
expect(screen.queryByText('testi.fi')).toBeNull()
expect(screen.queryByText('3')).toBeNull()})