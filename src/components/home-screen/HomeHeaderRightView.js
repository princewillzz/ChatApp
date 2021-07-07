import React from 'react';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import {Icon} from 'react-native-elements';

export default function HomeHeaderRightView({
  toggleShowSearchBox,
  showSearchBox,
  navigation,
}) {
  return (
    <View style={styles.container}>
      <TouchableOpacity>
        <Icon
          onPress={() => toggleShowSearchBox(!showSearchBox)}
          style={styles.searchIcon}
          name="search-outline"
          type="ionicon"
        />
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.openDrawer()}>
        <Icon
          style={styles.moreIcon}
          name="ellipsis-vertical-outline"
          type="ionicon"
        />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
  },
  searchIcon: {
    marginRight: 5,
  },
  moreIcon: {
    marginLeft: 10,
  },
});
