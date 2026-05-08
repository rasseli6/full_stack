import { View, StyleSheet, ScrollView, Pressable } from 'react-native'
import Constants from 'expo-constants'
import { Link } from 'react-router-native'
import { useApolloClient, useQuery } from '@apollo/client/react'

import Text from './Text'
import { ME } from '../graphql/queries'
import useAuthStorage from '../hooks/useAuthStorage'

const styles = StyleSheet.create({
  container: {
    paddingTop: Constants.statusBarHeight,
    backgroundColor: '#24292e',
    paddingBottom: 16,
    paddingHorizontal: 16,
  },
  tab: {
    marginRight: 16,
  },
  text: {
    color: 'white',
  },
})

const AppBar = () => {
  const { data } = useQuery(ME, {
    fetchPolicy: 'cache-and-network',
  })

  const authStorage = useAuthStorage()
  const apolloClient = useApolloClient()

  const signOut = async () => {
    await authStorage.removeAccessToken()
    await apolloClient.resetStore()
  }

  return (
    <View style={styles.container}>
      <ScrollView horizontal>
        <Link to="/" style={styles.tab}>
          <Text fontWeight="bold" fontSize="subheading" style={styles.text}>
            Repositories
          </Text>
        </Link>

        {data?.me && (
          <Link to="/create-review" style={styles.tab}>
            <Text fontWeight="bold" fontSize="subheading" style={styles.text}>
              Create a review
            </Text>
          </Link>
        )}

        {data?.me && (
          <Link to="/my-reviews" style={styles.tab}>
            <Text fontWeight="bold" fontSize="subheading" style={styles.text}>
              My reviews
            </Text>
          </Link>
        )}

        {data?.me ? (
          <Pressable onPress={signOut} style={styles.tab}>
            <Text fontWeight="bold" fontSize="subheading" style={styles.text}>
              Sign out
            </Text>
          </Pressable>
        ) : (
          <>
            <Link to="/signin" style={styles.tab}>
              <Text fontWeight="bold" fontSize="subheading" style={styles.text}>
                Sign in
              </Text>
            </Link>

            <Link to="/signup" style={styles.tab}>
              <Text fontWeight="bold" fontSize="subheading" style={styles.text}>
                Sign up
              </Text>
            </Link>
          </>
        )}
      </ScrollView>
    </View>
  )
}

export default AppBar