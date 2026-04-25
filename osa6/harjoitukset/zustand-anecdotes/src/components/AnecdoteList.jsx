import { useAnecdotes, useAnecdoteActions, useFilter } from '../store'
import { useNotificationActions } from '../NotificationStore'

const AnecdoteList = () => {
  const anecdotes = useAnecdotes()
  const { voted, remove } = useAnecdoteActions()
  const filter = useFilter()
  const { setNotification } = useNotificationActions()

  const vote = id => {
    const votedAnecdote = anecdotes.find(a => a.id === id)
    voted(id)
    setNotification(`You voted '${votedAnecdote.content}'`)
    
  }

  const AnecdotesToShow = anecdotes.filter ( anecdote => {
    if (anecdote.content.includes(filter) ) return anecdote
  })

  return (
    <div>
    <h2>Anecdotes</h2>
      {AnecdotesToShow.toSorted((a, b) => b.votes - a.votes).map(anecdote => (
        <div key={anecdote.id}>
          <div>{anecdote.content}</div>
          <div>
            has {anecdote.votes}
            <button onClick={() => vote(anecdote.id)}>vote</button>
            {anecdote.votes === 0 &&
            <button onClick={() => remove(anecdote.id)}>remove</button>}
          </div>
        </div>
        ))}
    </div>
      
      )
  }
export default AnecdoteList
