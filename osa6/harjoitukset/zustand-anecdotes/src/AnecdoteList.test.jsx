import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import useAnecdoteStore from './store'
import AnecdoteList from './components/AnecdoteList'
import { vi, beforeEach, expect, describe, it  } from 'vitest'
vi.mock('./services/anecdotes', () => ({
    default: {
        getAll: vi.fn(),
        createNew: vi.fn(),
    }
}))

beforeEach(() => {
  useAnecdoteStore.setState({
    anecdotes: [
      { id: 1, content: 'vähiten ääniä', votes: 3 },
      { id: 2, content: 'eniten ääniä', votes: 5 },
      { id: 3, content: 'ei ääniä', votes: 0 },
    ],
    filter: ''
  })
})

describe('List is in right order', () => {
    it('right order?', () => {
        render(<AnecdoteList />)
        const result = screen.getAllByText(/vähiten ääniä|eniten ääniä|ei ääniä/)
        expect(result[0]).toHaveTextContent('eniten ääniä')
        expect(result[1]).toHaveTextContent('vähiten ääniä')
        expect(result[2]).toHaveTextContent('ei ääniä')
    })
    it('right amount of anecdotes', () => {
        useAnecdoteStore.setState({ filter: 'ei'})
        render(<AnecdoteList/>)
        const result = screen.getAllByText(/vähiten ääniä|eniten ääniä|ei ääniä/)
        expect(result[0]).toHaveTextContent('ei ääniä')
        expect(screen.queryByText('vähiten ääniä')).toBeNull()
        expect(screen.queryByText('eniten ääniä')).toBeNull()
    })

})