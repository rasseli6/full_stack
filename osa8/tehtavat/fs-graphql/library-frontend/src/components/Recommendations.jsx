import { useQuery } from '@apollo/client/react'
import { ALL_BOOKS, ME } from '../queries'

const Recommendations = ({ show }) => {
  const meResult = useQuery(ME, {
    skip: !show,
    fetchPolicy: 'network-only',
  })

  const favoriteGenre = meResult.data?.me?.favoriteGenre

  const booksResult = useQuery(ALL_BOOKS, {
    variables: { genre: favoriteGenre },
    skip: !show || !favoriteGenre,
    fetchPolicy: 'network-only',
  })

  if (!show) {
    return null
  }

  if (meResult.loading || booksResult.loading || !favoriteGenre || !booksResult.data) {
    return (
      <div>
        <h2>recommendations</h2>
        <div>loading...</div>
      </div>
    )
  }

  const books = booksResult.data.allBooks

  return (
    <div>
      <h2>recommendations</h2>

      <div>books in your favorite genre</div>
      <div>
        <strong>{favoriteGenre}</strong>
      </div>

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
    </div>
  )
}

export default Recommendations