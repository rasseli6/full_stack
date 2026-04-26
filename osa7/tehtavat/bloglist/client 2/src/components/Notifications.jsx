import { useNotification } from '../stores/notificationStore'
import { Alert } from '@mui/material'

const Notification = () => {
  const message = useNotification()
  if (!message) {
    return null
  }
  return (
    <Alert style={{ marginTop: 8, marginBottom: 8 }} severity="success">
      {message}
    </Alert>
  )
}

export default Notification
