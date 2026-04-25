import { useAnecdoteActions } from '../store'
import { useNotificationActions } from '../NotificationStore'

const AnecdoteForm = () => {
    const { add } = useAnecdoteActions()
    const { setNotification } = useNotificationActions()

    const addAnecdote = (e) => {
    e.preventDefault()
    const content = e.target.anecdote.value
    add(content)
    e.target.reset()
    setNotification('New anecdote added')
    }
    
    return (<div>
      
      <h2>create new</h2>
      <form onSubmit={addAnecdote}>
          <input name="anecdote" />
          <button type="submit">add</button>
        </form>
    </div>)
    }
export default AnecdoteForm