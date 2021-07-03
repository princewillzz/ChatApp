import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import jwtDecode from 'jwt-decode';
import React from 'react';
import Toast from 'react-native-toast-message';
import {signinUser} from './src/api/auth-api';
import {registerUser} from './src/api/users-api';
import AuthContext from './src/auth/auth';
import {
  deleteUserByToken,
  getActiveUser,
  insertUserSignedIn,
} from './src/db/UsersDB';
import ChatBotTalkScreen from './src/screens/ChatBotTalkScreen';
import ChatScreen from './src/screens/ChatScreen';
import HomeScreenDrawerNavigation from './src/screens/HomeScreenDrawerNavigation';
import RegisterScreen from './src/screens/RegisterScreen';
import SignInScreen from './src/screens/SignInScreen';
import {generateRsaKeys} from './src/security/RSAEncryptionService';
import {constructProfilePhotoURIWithImageId} from './src/services/utility-service';

const Stack = createStackNavigator();

export default function App() {
  const [currentUserInfo, setCurrentUserInfo] = React.useState('');

  const [state, dispatch] = React.useReducer(
    (prevState, action) => {
      switch (action.type) {
        case 'RESTORE_TOKEN':
          return {
            ...prevState,
            userToken: action.token,
            isLoading: false,
          };
        case 'SIGN_IN':
          return {
            ...prevState,
            isSignout: false,
            userToken: action.token,
          };
        case 'SIGN_OUT':
          return {
            ...prevState,
            isSignout: true,
            userToken: null,
          };
      }
    },
    {
      isLoading: true,
      isSignout: false,
      userToken: null,
    },
  );

  React.useEffect(() => {
    // deleteAllUsers().then(() => console.log('Success deleted'));

    // fetchAllUsers().then(users => console.log(users));

    // Fetch the token from storage then navigate to our appropriate place
    const bootstrapAsync = async () => {
      let userToken = null;

      try {
        getActiveUser()
          .then(user => {
            if (user?.length > 0) {
              userToken = user[0].token_id;
              // console.log('UserToken', userToken);
              handleCurrentUserInit(userToken);

              dispatch({type: 'RESTORE_TOKEN', token: userToken});
            }
          })
          .catch(e => console.log(e));
      } catch (e) {
        // Restoring token failed
      }

      // After restoring token, we may need to validate it in production apps

      // This will switch to the App screen or Auth screen and this loading
      // screen will be unmounted and thrown away.
      dispatch({type: 'RESTORE_TOKEN', token: userToken});
    };

    bootstrapAsync();

    return () => {
      setCurrentUserInfo({});
    };
  }, []);

  const handleCurrentUserInit = token => {
    const decodedToken = jwtDecode(token);

    let profile_img_uri = null;
    if (decodedToken?.profile_image) {
      profile_img_uri = constructProfilePhotoURIWithImageId(
        decodedToken.profile_image,
      );
    }

    const currentUserInfo = {
      username: decodedToken.sub,
      token_id: token,
      image: profile_img_uri,
    };

    try {
      console.log(decodedToken);
      // fetchUserById(currentUserInfo.token_id)
      //   .then(user => {
      //     let imageURI = null;

      //     if (user?.imageId) {
      //       imageURI = constructProfilePhotoURIWithImageId(user.imageId);
      //       setCurrentUserInfo({...currentUserInfo, image: imageURI});
      //     }
      //   })
      //   .catch(e => {
      //     console.log(e);
      //   });
    } catch (error) {
      console.log(error);
    }

    setCurrentUserInfo(currentUserInfo);
  };

  const authContext = React.useMemo(
    () => ({
      signIn: async siginInfo => {
        return signinUser(siginInfo).then(responseData => {
          insertUserSignedIn({
            token_id: responseData.id_token,
            loggedAt: new Date().toUTCString(),
            status: 'active',
          })
            .then(() => {
              handleCurrentUserInit(responseData.id_token);

              dispatch({type: 'SIGN_IN', token: responseData.id_token});
            })
            .catch(e => console.log(e));
        });
      },
      signOut: () => {
        deleteUserByToken(currentUserInfo.token_id)
          .then(() => dispatch({type: 'SIGN_OUT'}))
          .catch(e => console.log(e));
      },
      signUp: async userInfo => {
        // ISSUE right here
        const rsa_keys = await generateRsaKeys(userInfo.username);
        userInfo.publicRSAKey = rsa_keys.public;
        return registerUser(userInfo).then(responseData => {
          insertUserSignedIn({
            token_id: responseData.id_token,
            loggedAt: new Date().toUTCString(),
            status: 'active',
          })
            .then(() => {
              handleCurrentUserInit(responseData.id_token);

              dispatch({type: 'SIGN_IN', token: responseData.id_token});
            })
            .catch(e => console.log(e));
          // dispatch({ type: "SIGN_IN", token: responseDate.id_token });
        });
      },
      currentUserInfo: currentUserInfo,
      updateCurrentUserImage: image =>
        setCurrentUserInfo({...currentUserInfo, image: image}),
    }),
    [currentUserInfo],
  );

  return (
    <AuthContext.Provider value={authContext}>
      <NavigationContainer>
        <Stack.Navigator>
          {state.userToken == null ? (
            <>
              <Stack.Screen
                name="SignIn"
                component={SignInScreen}
                options={{
                  title: 'Login',
                  headerTitleAlign: 'center',
                  headerStyle: {
                    backgroundColor: 'dodgerblue',
                  },
                }}
              />
              <Stack.Screen
                name="Register"
                component={RegisterScreen}
                options={{
                  title: 'Register',
                  headerTitleAlign: 'center',
                  headerStyle: {
                    backgroundColor: 'dodgerblue',
                  },
                }}
              />
            </>
          ) : (
            <>
              <Stack.Screen
                name="Home"
                component={HomeScreenDrawerNavigation}
                options={{
                  headerShown: false,
                }}
              />
              <Stack.Screen
                name="Chat"
                component={ChatScreen}
                options={{
                  headerShown: false,
                }}
              />
              <Stack.Screen
                name="ChatBot"
                component={ChatBotTalkScreen}
                options={{
                  headerShown: false,
                }}
              />
            </>
          )}
        </Stack.Navigator>
        <Toast ref={ref => Toast.setRef(ref)} />
      </NavigationContainer>
    </AuthContext.Provider>
  );
}
