import { View, StyleSheet, Image, Pressable } from 'react-native'
import Text from './Text'
import theme from '../theme'
import * as Linking from 'expo-linking'

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
  githubButton: {
    backgroundColor: theme.colors.primary,
    padding: 12,
    borderRadius: 4,
    alignItems: 'center',
    marginTop: 16,
  },
  githubButtonText: {
    color: 'white',
  },
  stats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  stat: {
    alignItems: 'center',
  },
})

const RepositoryItem = ({ repository, showGithubButton = false }) => {
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
        {showGithubButton && (
          <Pressable
            style={styles.githubButton}
            onPress={() => Linking.openURL(repository.url)}
          >
            <Text fontWeight="bold" style={styles.githubButtonText}>
              Open in GitHub
            </Text>
          </Pressable>
        )}
      </View>
    </View>
  )
}

export default RepositoryItem