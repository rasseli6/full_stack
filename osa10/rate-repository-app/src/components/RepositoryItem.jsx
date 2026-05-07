import { View, StyleSheet, Image } from 'react-native'
import Text from './Text'
import theme from '../theme'

const formatCount = (count) => {
  if (count < 1000) {
    return count.toString()
  }

  return `${(count / 1000).toFixed(1).replace('.0', '')}k`
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.repositoryItemBackground,
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 4,
    marginRight: 16,
  },
  info: {
    flexShrink: 1,
  },
  fullName: {
    marginBottom: 4,
  },
  description: {
    marginBottom: 8,
  },
  language: {
    alignSelf: 'flex-start',
    backgroundColor: theme.colors.primary,
    color: 'white',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    overflow: 'hidden',
  },
  stats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  stat: {
    alignItems: 'center',
  },
})

const RepositoryItem = ({ repository }) => {
  return (
    <View testID="repositoryItem" style={styles.container}>
      <View style={styles.header}>
        <Image source={{ uri: repository.ownerAvatarUrl }} style={styles.avatar} />

        <View style={styles.info}>
          <Text fontWeight="bold" fontSize="subheading" style={styles.fullName}>
            {repository.fullName}
          </Text>

          <Text color="textSecondary" style={styles.description}>
            {repository.description}
          </Text>

          <Text style={styles.language}>
            {repository.language}
          </Text>
        </View>
      </View>

      <View style={styles.stats}>
        <View style={styles.stat}>
          <Text fontWeight="bold">{formatCount(repository.stargazersCount)}</Text>
          <Text color="textSecondary">Stars</Text>
        </View>

        <View style={styles.stat}>
          <Text fontWeight="bold">{formatCount(repository.forksCount)}</Text>
          <Text color="textSecondary">Forks</Text>
        </View>

        <View style={styles.stat}>
          <Text fontWeight="bold">{repository.reviewCount}</Text>
          <Text color="textSecondary">Reviews</Text>
        </View>

        <View style={styles.stat}>
          <Text fontWeight="bold">{repository.ratingAverage}</Text>
          <Text color="textSecondary">Rating</Text>
        </View>
      </View>
    </View>
  )
}

export default RepositoryItem