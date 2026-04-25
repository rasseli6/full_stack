import { create } from 'zustand'
import anecdoteService from './services/anecdotes'

const useAnecdoteStore = create((set) => ({
  anecdotes: [],
  filter: '',
  notification: '',
  actions: {
    add: async (content) => {
      const newAnecdote = await anecdoteService.createNew(content)
      set(state => ({ anecdotes: state.anecdotes.concat(newAnecdote)}))},
    voted: async (id) => {
      const anecdote = useAnecdoteStore.getState().anecdotes.find(n => n.id === id)
      const updated = await anecdoteService.update(id, {...anecdote, votes: anecdote.votes + 1 })
      set(state => ({
        anecdotes: state.anecdotes.map(n => n.id === id ? updated : n)
      }))
    },
    setFilter: value => set(() => ({ filter : value })),
    remove: async (id) => {
      await anecdoteService.deleteAnecdote(id)
      set(state => ({
          anecdotes: state.anecdotes.filter(a => a.id !== id)}))
    },
    initialize: async () => { const anecdotes = await anecdoteService.getAll() 
      set(() => ({ anecdotes }))}}
}))

export const useAnecdotes = () => useAnecdoteStore((state) => state.anecdotes)
export const useFilter = () => useAnecdoteStore((state) => state.filter )
export const useAnecdoteActions = () => useAnecdoteStore((state) => state.actions)
