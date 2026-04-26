import { Alert } from '@mui/material'

const Notification = ({ message }) => {
  if (message === null) {
    return null
  }
  return (
    <Alert style={{ marginTop: 8, marginBottom: 8 }} severity="success">
      {message}
    </Alert>
  )
}

export default Notification