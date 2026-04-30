import { useState } from 'react'
import { useQuery } from '@apollo/client/react'
import { ALL_BOOKS } from '../queries'

const Books = ({ show }) => {
  const [selectedGenre, setSelectedGenre] = useState(null)

  const result = useQuery(ALL_BOOKS, {
    variables: { genre: selectedGenre },
    fetchPolicy: 'network-only',
  })

  if (!show) {
    return null
  }

  if (result.loading) {
    return <div>loading...</div>
  }

  const books = result.data.allBooks

  const genres = [
    'refactoring',
    'agile',
    'patterns',
    'design',
    'crime',
    'classic',
    'revolution',
    'mongodb',
    'auth',
    'test',
  ]

  return (
    <div>
      <h2>books</h2>

      {selectedGenre && <div>in genre {selectedGenre}</div>}

      <table>
        <tbody>
          <tr>
            <th></th>
            <th>author</th>
            <th>published</th>
          </tr>
          {books.map((book) => (
            <tr key={book.title}>
              <td>{book.title}</td>
              <td>{book.author.name}</td>
              <td>{book.published}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div>
        {genres.map((genre) => (
          <button key={genre} onClick={() => setSelectedGenre(genre)}>
            {genre}
          </button>
        ))}
        <button onClick={() => setSelectedGenre(null)}>all genres</button>
      </div>
    </div>
  )
}

export default Books