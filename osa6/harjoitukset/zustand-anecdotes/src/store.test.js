import { beforeEach, describe, expect, it, vi } from 'vitest'
import { renderHook, act } from '@testing-library/react'

vi.mock('./services/anecdotes', () => ({
    default: {
        getAll: vi.fn(),
        createNew: vi.fn(),
        update: vi.fn(),
    }
}))

import anecdoteService from './services/anecdotes'
import useAnecdoteStore, { useAnecdotes, useAnecdoteActions } from './store'

beforeEach(() => {
    useAnecdoteStore.setState({ anecdotes: [] })
    vi.clearAllMocks()
})

describe("useAnecdoteActions", () => {
    it('initialize loads anecdotes from service', async () => {
        const mockAnecdotes = [{ id: 1, content: 'Test', votes: 0}]
        anecdoteService.getAll.mockResolvedValue(mockAnecdotes)

        const { result } = renderHook(() => useAnecdoteActions())
        await act(async () => {
            await result.current.initialize()
        })
        const { result: anecdotesResult } = renderHook(() => useAnecdotes())
        expect(anecdotesResult.current).toEqual(mockAnecdotes)
    }),
    it('voting will increase votes by 1', async () => {
        useAnecdoteStore.setState({
            anecdotes: [{ id: 1, content: 'Test', votes: 0 }]
        })
        anecdoteService.update.mockResolvedValue({ id: 1, content: 'Test', votes: 1 })
        const { result } = renderHook(() => useAnecdoteActions())
        await act(async () => {
        await result.current.voted(1)
        })
        const { result: anecdotesResult } = renderHook(() => useAnecdotes())
        expect(anecdotesResult.current[0].votes).toBe(1)
    })
})
