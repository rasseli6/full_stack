import { View, StyleSheet, ScrollView } from 'react-native'
import Constants from 'expo-constants'
import { Link } from 'react-router-native'

import Text from './Text'

const styles = StyleSheet.create({
  container: {
    paddingTop: Constants.statusBarHeight,
    backgroundColor: '#24292e',
    paddingBottom: 16,
    paddingHorizontal: 16,
    flexDirection: 'row',
  },
  tab: {
    marginRight: 16,
  },
  text: {
    color: 'white',
  },
})

const AppBar = () => {
  return (
    <View style={styles.container}>
      <ScrollView horizontal>
        <Link to="/" style={styles.tab}>
          <Text fontWeight="bold" fontSize="subheading" style={styles.text}>
            Repositories
          </Text>
        </Link>

        <Link to="/signin" style={styles.tab}>
          <Text fontWeight="bold" fontSize="subheading" style={styles.text}>
            Sign in
          </Text>
        </Link>
      </ScrollView>
    </View>
  )
}

export default AppBar