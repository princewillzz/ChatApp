import React, {useState} from 'react';
import {
  ImageBackground,
  Pressable,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import {Header, Icon, ListItem} from 'react-native-elements';
import {launchImageLibrary} from 'react-native-image-picker';
import {uploadUserProfilePhoto} from '../api/users-api';
import AuthContext from '../auth/auth';
import HeaderCenterComponent from '../components/settings/HeaderCenterComponent';
import HeaderLeftComponent from '../components/settings/HeaderLeftComponent';
import HeaderRightComponent from '../components/settings/HeaderRightComponent';
import {updateProfilePictureOfUser} from '../db/UsersDB';

const SettingsScreen = ({navigation}) => {
  const {currentUserInfo, updateCurrentUserImage} =
    React.useContext(AuthContext);

  const [userProfilePicture, setUserProfilePicture] = useState(
    // 'https://picsum.photos/200/300',
    null,
  );

  const [isClickedToChangeProfile, setIsClickedToChangeProfile] =
    useState(false);

  const toggleIsClickedToChangeProfile = () =>
    setIsClickedToChangeProfile(!isClickedToChangeProfile);

  const handleChooseProfileImage = () => {
    const options = {
      noData: true,
    };

    launchImageLibrary(options, response => {
      if (response.didCancel) return;
      try {
        const image = response.assets[0];
        setUserProfilePicture(image.uri);
        updateCurrentUserImage(image.uri);

        const imageToUpload = {
          uri: image?.uri,
          type: image?.type,
          name: image?.fileName,
        };

        uploadUserProfilePhoto(imageToUpload, currentUserInfo?.token_id)
          .then(res => {
            if (res.status == 200) {
              console.log('Successfully uploaded');

              return res.json();
            } else throw new Error('Unable to upload DP');
          })
          .then(data => {
            if (data?.keys?.length > 0) {
              updateProfilePictureOfUser(
                currentUserInfo?.token_id,
                data.keys[0],
              )
                .then(() => {
                  console.log('Succesfully Saved');
                })
                .catch(e => {
                  console.log(e);
                });
            }
          })
          .catch(e => {
            console.log(e);
          });
      } catch (error) {}
      toggleIsClickedToChangeProfile();
    });
  };

  React.useEffect(() => {
    setUserProfilePicture(currentUserInfo?.image);
  }, []);

  return (
    <>
      <Header
        containerStyle={{
          backgroundColor: '#ECECEC',
        }}
        leftComponent={<HeaderLeftComponent navigation={navigation} />}
        centerComponent={HeaderCenterComponent}
        rightComponent={<HeaderRightComponent navigation={navigation} />}
      />

      <View style={styles.profileContainer}>
        <TouchableOpacity onPress={toggleIsClickedToChangeProfile}>
          <ImageBackground
            source={{
              uri: userProfilePicture ? userProfilePicture : null,
            }}
            blurRadius={isClickedToChangeProfile ? 10 : 0}
            imageStyle={styles.profileAvatar}
            style={styles.profileAvatarImageContainer}>
            {(!userProfilePicture || isClickedToChangeProfile) && (
              <Pressable onPress={handleChooseProfileImage}>
                <Icon name="camera" type="ionicon" size={60} />
              </Pressable>
            )}
          </ImageBackground>
        </TouchableOpacity>
      </View>

      <View style={styles.listContainer}>
        <ListItem containerStyle={styles.listItem} bottomDivider>
          <Icon name="call-outline" type="ionicon" />
          <ListItem.Content>
            <ListItem.Subtitle>Phone</ListItem.Subtitle>
            <ListItem.Title>8918930270</ListItem.Title>
          </ListItem.Content>
        </ListItem>
        <ListItem containerStyle={styles.listItem} bottomDivider>
          <Icon name="help-circle-outline" type="ionicon" />
          <ListItem.Content>
            <ListItem.Title>Help</ListItem.Title>
          </ListItem.Content>
        </ListItem>
      </View>
    </>
  );
};

const profileAvatarHeight = 200;

const styles = StyleSheet.create({
  profileContainer: {
    alignItems: 'center',
    marginBottom: 20,
    borderBottomColor: 'silver',
    borderBottomWidth: 1,
  },
  profileAvatarImageContainer: {
    marginTop: 20,
    marginBottom: 20,
    width: profileAvatarHeight,
    height: profileAvatarHeight,
    backgroundColor: 'silver',
    borderRadius: profileAvatarHeight / 2,
    resizeMode: 'cover',
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileAvatar: {
    borderRadius: profileAvatarHeight / 2,
  },

  listContainer: {
    alignItems: 'center',
  },
  listItem: {
    elevation: 2,
    width: '90%',
    marginVertical: 10,
    borderRadius: 11,
    // backgroundColor: 'dodgerblue',
  },
});

export default SettingsScreen;
