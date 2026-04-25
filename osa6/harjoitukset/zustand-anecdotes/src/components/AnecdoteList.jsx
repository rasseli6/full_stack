import { useAnecdotes, useAnecdoteActions, useFilter } from '../store'

const AnecdoteList = () => {
  const anecdotes = useAnecdotes()
  const { voted } = useAnecdoteActions()
  const filter = useFilter()

  const vote = id => {
    voted(id)
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
          </div>
        </div>
        ))}
    </div>
      
      )
  }
export default AnecdoteList
