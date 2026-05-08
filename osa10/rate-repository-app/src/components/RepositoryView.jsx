import { FlatList, View, StyleSheet } from 'react-native'
import { useParams } from 'react-router-native'
import { format } from 'date-fns'

import RepositoryItem from './RepositoryItem'
import Text from './Text'
import theme from '../theme'
import useRepository from '../hooks/useRepository'

const styles = StyleSheet.create({
  separator: {
    height: 10,
    backgroundColor: theme.colors.background,
  },
  reviewContainer: {
    flexDirection: 'row',
    backgroundColor: 'white',
    padding: 16,
  },
  ratingContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: theme.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  ratingText: {
    color: theme.colors.primary,
  },
  reviewContent: {
    flexShrink: 1,
  },
  username: {
    marginBottom: 4,
  },
  date: {
    marginBottom: 8,
  },
})

const ItemSeparator = () => <View style={styles.separator} />

const ReviewItem = ({ review }) => {
  return (
    <View style={styles.reviewContainer}>
      <View style={styles.ratingContainer}>
        <Text fontWeight="bold" style={styles.ratingText}>
          {review.rating}
        </Text>
      </View>

      <View style={styles.reviewContent}>
        <Text fontWeight="bold" style={styles.username}>
          {review.user.username}
        </Text>

        <Text color="textSecondary" style={styles.date}>
          {format(new Date(review.createdAt), 'dd MMM yyyy')}
        </Text>

        <Text>{review.text}</Text>
      </View>
    </View>
  )
}

const RepositoryView = () => {
  const { id } = useParams()
  const { repository } = useRepository(id)

  if (!repository) {
    return null
  }

  const reviews = repository.reviews
    ? repository.reviews.edges.map((edge) => edge.node)
    : []

  return (
    <FlatList
      data={reviews}
      renderItem={({ item }) => <ReviewItem review={item} />}
      keyExtractor={(item) => item.id}
      ItemSeparatorComponent={ItemSeparator}
      ListHeaderComponent={() => (
        <RepositoryItem repository={repository} showGithubButton />
      )}
    />
  )
}

export default RepositoryView