import { useEffect, useState } from 'react'
import axios from 'axios'

const App = () => {
  const [notes, setNotes] = useState([])

  useEffect(() => {
    axios.get('http://localhost:3001/notes').then(response => {
      setNotes(response.data)
    })
  }, [])

  return (
    <div>
      <h1>Notes</h1>
      <ul>
        {notes.map(note => (
          <li key={note.id}>{note.content}</li>
        ))}
      </ul>
    </div>
  )
}

export default App