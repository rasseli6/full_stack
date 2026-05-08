import { FlatList, View, StyleSheet, Pressable } from 'react-native'
import { useNavigate } from 'react-router-native'
import { useState } from 'react'
import { Searchbar, Menu, Button } from 'react-native-paper'
import { useDebounce } from 'use-debounce'

import RepositoryItem from './RepositoryItem'
import theme from '../theme'
import useRepositories from '../hooks/useRepositories'

const styles = StyleSheet.create({
  separator: {
    height: 10,
    backgroundColor: theme.colors.background,
  },
})

const sortOptions = {
  latest: {
    label: 'Latest repositories',
    variables: {
      orderBy: 'CREATED_AT',
      orderDirection: 'DESC',
    },
  },
  highestRated: {
    label: 'Highest rated repositories',
    variables: {
      orderBy: 'RATING_AVERAGE',
      orderDirection: 'DESC',
    },
  },
  lowestRated: {
    label: 'Lowest rated repositories',
    variables: {
      orderBy: 'RATING_AVERAGE',
      orderDirection: 'ASC',
    },
  },
}

const ItemSeparator = () => <View style={styles.separator} />

export const RepositoryListContainer = ({
  repositories,
  onPressRepository = () => {},
  ListHeaderComponent,
  onEndReached,
}) => {
  const repositoryNodes = repositories
    ? repositories.edges.map((edge) => edge.node)
    : []

  return (
    <FlatList
      data={repositoryNodes}
      ItemSeparatorComponent={ItemSeparator}
      ListHeaderComponent={ListHeaderComponent}
      onEndReached={onEndReached}
      onEndReachedThreshold={0.5}
      renderItem={({ item }) => (
        <Pressable onPress={() => onPressRepository(item.id)}>
          <RepositoryItem repository={item} />
        </Pressable>
      )}
      keyExtractor={(item) => item.id}
    />
  )
}

const RepositoryList = () => {
  const [selectedSort, setSelectedSort] = useState('latest')
  const [menuVisible, setMenuVisible] = useState(false)
  const [searchKeyword, setSearchKeyword] = useState('')
  const [debouncedSearchKeyword] = useDebounce(searchKeyword, 500)

  const { repositories, fetchMore } = useRepositories({
    first: 5,
    ...sortOptions[selectedSort].variables,
    searchKeyword: debouncedSearchKeyword,
  })
  const navigate = useNavigate()

  const onPressRepository = (id) => {
    navigate(`/repository/${id}`)
  }


  const onSelectSort = (sort) => {
    setSelectedSort(sort)
    setMenuVisible(false)
  }

  const ListHeader = () => (
  <View>
    <Searchbar
      placeholder="Search"
      value={searchKeyword}
      onChangeText={setSearchKeyword}
    />

    <Menu
      visible={menuVisible}
      onDismiss={() => setMenuVisible(false)}
      anchor={
        <Button onPress={() => setMenuVisible(true)}>
          {sortOptions[selectedSort].label}
        </Button>
      }
    >
      <Menu.Item
        onPress={() => onSelectSort('latest')}
        title="Latest repositories"
      />
      <Menu.Item
        onPress={() => onSelectSort('highestRated')}
        title="Highest rated repositories"
      />
      <Menu.Item
        onPress={() => onSelectSort('lowestRated')}
        title="Lowest rated repositories"
      />
    </Menu>
  </View>
)

  return (
    <RepositoryListContainer
      repositories={repositories}
      onPressRepository={onPressRepository}
      ListHeaderComponent={ListHeader}
      onEndReached={fetchMore}
    />
  )
}

export default RepositoryList
