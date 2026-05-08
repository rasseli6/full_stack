import { useQuery } from '@apollo/client/react'

import { GET_REPOSITORIES } from '../graphql/queries'

const useRepositories = (variables) => {
  const { data, loading, fetchMore, ...result } = useQuery(GET_REPOSITORIES, {
    variables,
    fetchPolicy: 'cache-and-network',
  })

  const handleFetchMore = () => {
    console.log('fetchMore called')

    const canFetchMore =
      !loading && data?.repositories.pageInfo.hasNextPage

    console.log('canFetchMore:', canFetchMore)
    console.log('pageInfo:', data?.repositories.pageInfo)

    if (!canFetchMore) {
      return
    }

    fetchMore({
      variables: {
        ...variables,
        after: data.repositories.pageInfo.endCursor,
      },
    })
  }

  return {
    repositories: data ? data.repositories : undefined,
    fetchMore: handleFetchMore,
    loading,
    ...result,
  }
}

export default useRepositories