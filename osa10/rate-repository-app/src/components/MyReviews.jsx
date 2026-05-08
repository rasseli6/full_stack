import { FlatList, View, StyleSheet, Pressable, Alert } from 'react-native'
import { useNavigate } from 'react-router-native'
import { format } from 'date-fns'

import Text from './Text'
import theme from '../theme'
import useMe from '../hooks/useMe'
import useDeleteReview from '../hooks/useDeleteReview'

const styles = StyleSheet.create({
  separator: {
    height: 10,
    backgroundColor: theme.colors.background,
  },
  reviewContainer: {
    backgroundColor: 'white',
  },
  reviewContentRow: {
    flexDirection: 'row',
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
  repositoryName: {
    marginBottom: 4,
  },
  date: {
    marginBottom: 8,
  },
  actions: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  button: {
    flex: 1,
    padding: 12,
    borderRadius: 4,
    alignItems: 'center',
  },
  viewButton: {
    backgroundColor: theme.colors.primary,
    marginRight: 12,
  },
  deleteButton: {
    backgroundColor: '#d73a4a',
  },
  buttonText: {
    color: 'white',
  },
})

const ItemSeparator = () => <View style={styles.separator} />

const ReviewItem = ({ review, onViewRepository, onDeleteReview }) => {
  return (
    <View style={styles.reviewContainer}>
      <View style={styles.reviewContentRow}>
        <View style={styles.ratingContainer}>
          <Text fontWeight="bold" style={styles.ratingText}>
            {review.rating}
          </Text>
        </View>

        <View style={styles.reviewContent}>
          <Text fontWeight="bold" style={styles.repositoryName}>
            {review.repository.fullName}
          </Text>

          <Text color="textSecondary" style={styles.date}>
            {format(new Date(review.createdAt), 'dd MMM yyyy')}
          </Text>

          <Text>{review.text}</Text>
        </View>
      </View>

      <View style={styles.actions}>
        <Pressable
          style={[styles.button, styles.viewButton]}
          onPress={() => onViewRepository(review.repository.id)}
        >
          <Text fontWeight="bold" style={styles.buttonText}>
            View repository
          </Text>
        </Pressable>

        <Pressable
          style={[styles.button, styles.deleteButton]}
          onPress={() => onDeleteReview(review.id)}
        >
          <Text fontWeight="bold" style={styles.buttonText}>
            Delete review
          </Text>
        </Pressable>
      </View>
    </View>
  )
}

const MyReviews = () => {
  console.log('MyReviews rendered')
  const navigate = useNavigate()
  const [deleteReview] = useDeleteReview()
  const { me, refetch } = useMe({ includeReviews: true })

  const reviews = me?.reviews
    ? me.reviews.edges.map((edge) => edge.node)
    : []

  const onViewRepository = (repositoryId) => {
    navigate(`/repository/${repositoryId}`)
  }

  const onDeleteReview = (reviewId) => {
    Alert.alert(
        'Delete review',
        'Are you sure you want to delete this review?',
        [
        {
            text: 'Cancel',
            style: 'cancel',
        },
        {
            text: 'Delete',
            onPress: async () => {
            await deleteReview(reviewId)
            await refetch()
            },
        },
    ],
  )
}

  return (
    <FlatList
      data={reviews}
      renderItem={({ item }) => (
        <ReviewItem
          review={item}
          onViewRepository={onViewRepository}
          onDeleteReview={onDeleteReview}
        />
      )}
      keyExtractor={(item) => item.id}
      ItemSeparatorComponent={ItemSeparator}
    />
  )
}

export default MyReviews