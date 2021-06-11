import React, {useCallback, useEffect, useState} from 'react';
import {FlatList, StyleSheet, View} from 'react-native';
import {Header, Icon, ListItem} from 'react-native-elements';
import AuthContext from '../auth/auth';
import CustomBottonFloatingSyncButton from '../components/CustomBottonFloatingSyncButton';
import HomeHeaderLeftView from '../components/HomeHeaderLeftView';
import HomeHeaderRightView from '../components/HomeHeaderRightView';
import ImageModal from '../components/ImageModal';
import RecentChat from '../components/RecentChat';
import SearchBox from '../components/SearchBox';
import {
  fetchAllRecentChatUsers,
  recentChatsSchemaRealmObject,
  removeAllRecentChats,
} from '../db/recent_chat_users';

export default function HomeScreen({navigation}) {
  const {currentUserInfo} = React.useContext(AuthContext);

  const [recentChatUsers, setRecentChatUsers] = useState([]);

  // search feature
  const [showSearchBox, setShowSearchBox] = useState(false);
  const [searchResultUsers, setSearchResultUsers] = useState([]);
  // seach text
  const [seachChatText, setSearchChatText] = useState(null);

  // Zoom on the profile picture of all your contact
  const [imageToBeShownOnModal, setImageToBeShownOnModal] = useState(null);
  const [showImageModal, setShowImageModal] = useState(false);

  const handleCloseImageModal = useCallback(() => setShowImageModal(false), []);
  const handleOpenImageModal = useCallback(image => {
    setShowImageModal(true);
    setImageToBeShownOnModal(image);
  }, []);

  // Search box
  const toggleShowSearchBox = state => {
    if (showSearchBox !== state) {
      setShowSearchBox(state);
      if (!state) {
        setSearchChatText(null);
      }
    }
  };

  // handle Search
  const handleSearchOnChange = value => {
    setSearchChatText(value);

    setSearchResultUsers(
      recentChatUsers.filter(user =>
        user.username.toLowerCase().includes(value),
      ),
    );
  };

  useEffect(() => {
    // removeAllRecentChats().then(() => {
    fetchAllRecentChatUsers()
      .then(recentChatUsers => {
        setRecentChatUsers(recentChatUsers);
        // setRecentChatUsers(users);
      })
      .catch(e => {
        console.log(e);
      });
    // });

    recentChatsSchemaRealmObject.addListener('change', () => {
      // setRecentChatUsers(recentChatUsers);
      fetchAllRecentChatUsers()
        .then(recentChatUsers => {
          setRecentChatUsers(recentChatUsers);
        })
        .catch(e => {
          console.log(e);
        });
    });
  }, []);

  return (
    <>
      <Header
        containerStyle={{
          backgroundColor: '#ECECEC',
        }}
        leftComponent={
          <HomeHeaderLeftView
            image={currentUserInfo?.image}
            handleOpenImageModal={handleOpenImageModal}
          />
        }
        rightComponent={
          <HomeHeaderRightView
            navigation={navigation}
            showSearchBox={showSearchBox}
            toggleShowSearchBox={toggleShowSearchBox}
          />
        }
      />

      {showSearchBox && (
        <SearchBox
          handleSearchOnChange={handleSearchOnChange}
          seachChatText={seachChatText}
          toggleShowSearchBox={toggleShowSearchBox}
        />
      )}

      <View
        style={styles.container}
        onTouchStart={() => toggleShowSearchBox(false)}>
        {/* If no contact was found show this alert message */}
        {recentChatUsers?.length <= 0 && (
          <ListItem
            style={styles.NoRecetChatsContainer}
            containerStyle={{
              backgroundColor: '#CCE5FF',
            }}
            bottomDivider>
            <ListItem.Content
              style={{
                alignItems: 'center',
                flexDirection: 'row',
              }}>
              <Icon
                name="alert-circle-outline"
                type="ionicon"
                style={{marginRight: 5}}
              />
              <ListItem.Title>No Recent Chats!!</ListItem.Title>
            </ListItem.Content>
          </ListItem>
        )}

        {/* show list of users */}
        {!seachChatText ? (
          <FlatList
            style={styles.recentChats}
            data={recentChatUsers}
            renderItem={({item}) => (
              <RecentChat
                handleOpenImageModal={handleOpenImageModal}
                navigation={navigation}
                userInfo={item}
                key={item.user_id}
              />
            )}
            keyExtractor={_ => _.user_id}
          />
        ) : (
          <>
            {/* list of searched users */}
            <FlatList
              style={styles.recentChats}
              data={searchResultUsers}
              renderItem={({item}) => (
                <RecentChat
                  handleOpenImageModal={handleOpenImageModal}
                  navigation={navigation}
                  userInfo={item}
                  key={item.user_id}
                />
              )}
              keyExtractor={_ => _.user_id}
            />
            {/* Alert messag on Nothing found */}
            {searchResultUsers?.length <= 0 && (
              <ListItem
                style={styles.nothingFoundSearch}
                containerStyle={{
                  backgroundColor: '#ECECEC',
                }}
                bottomDivider>
                <ListItem.Content
                  style={{
                    alignItems: 'center',
                    flexDirection: 'row',
                  }}>
                  <Icon
                    name="alert-circle-outline"
                    type="ionicon"
                    style={{marginRight: 5}}
                  />
                  <ListItem.Title>Nothing Found</ListItem.Title>
                </ListItem.Content>
              </ListItem>
            )}
          </>
        )}
      </View>

      <CustomBottonFloatingSyncButton
        currentUserInfo={currentUserInfo}
        recentChatUsers={recentChatUsers}
      />

      <ImageModal
        images={{uri: imageToBeShownOnModal}}
        showImageModal={showImageModal}
        handleOpenImageModal={handleOpenImageModal}
        handleCloseImageModal={handleCloseImageModal}
      />
    </>
  );
}

const styles = StyleSheet.create({
  NoRecetChatsContainer: {
    elevation: 4,
    position: 'absolute',
    width: '100%',
  },
  NoRecetChatsText: {
    fontSize: 18,
    textAlign: 'center',
    color: '#596998',
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  recentChats: {
    flex: 1,
    // backgroundColor: "blue",
    // flexDirection: "column",
  },
  searchBarContainer: {
    elevation: 30,
    top: 0,
  },
  searchBar: {
    width: '95%',
    alignSelf: 'center',
    height: 40,
    borderRadius: 10,
    // backgroundColor: "silver",
  },
  nothingFoundSearch: {
    position: 'absolute',
    width: '100%',
  },
});
