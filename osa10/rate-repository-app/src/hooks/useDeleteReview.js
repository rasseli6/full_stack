import { useMutation } from '@apollo/client/react'

import { DELETE_REVIEW } from '../graphql/mutations'

const useDeleteReview = () => {
  const [mutate, result] = useMutation(DELETE_REVIEW)

  const deleteReview = async (id) => {
    console.log('deleteReview hook called with id:', id)

    const response = await mutate({
      variables: {
        id,
      },
    })

    console.log('deleteReview mutation response:', response)

    return response
  }

  return [deleteReview, result]
}

export default useDeleteReview