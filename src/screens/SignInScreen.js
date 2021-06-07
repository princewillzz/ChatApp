import moment from 'moment';
import React from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  StatusBar,
  StyleSheet,
  View,
} from 'react-native';
import {Button, Icon, Input} from 'react-native-elements';
import Toast from 'react-native-toast-message';
import AuthContext from '../auth/auth';

export default function SignInScreen({navigation}) {
  const [username, setUsername] = React.useState('harsh');
  const [password, setPassword] = React.useState('password');

  const [isLoading, setLoading] = React.useState(true);

  React.useEffect(() => {
    setLoading(false);
  }, []);

  const {signIn} = React.useContext(AuthContext);

  const usernameInput = React.createRef();
  const passwordInput = React.createRef();

  const handleSignIn = async () => {
    if (!username) {
      usernameInput.current.shake();
      return;
    }
    if (!password) {
      passwordInput.current.shake();
      return;
    }

    setLoading(true);
    signIn({username, password}).catch(e => {
      setLoading(false);
      Toast.show({
        type: 'error',
        position: 'top',
        text1: 'Invalid credentials ',
        visibilityTime: 1200,
        autoHide: true,
      });
    });
  };

  return (
    <>
      {/* <StatusBar barStyle="light-content" backgroundColor="dodgerblue" /> */}
      {/* <Header
				backgroundColor="silver"
				centerComponent={{
					text: "Login",
					style: { color: "black", fontSize: 20 },
				}}
			/> */}

      {isLoading && (
        <View style={[styles.loadingContainer]}>
          <ActivityIndicator size="large" color="#3178D2" />
        </View>
      )}
      <View style={styles.container}>
        <KeyboardAvoidingView style={styles.formContainer}>
          <Input
            placeholder="username"
            value={username}
            onChangeText={setUsername}
            containerStyle={{
              alignContent: 'center',
              width: '70%',
            }}
            leftIcon={
              <Icon
                name="person-circle-outline"
                size={22}
                color="black"
                type="ionicon"
              />
            }
            ref={usernameInput}
          />
          <Input
            placeholder="password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            containerStyle={{
              alignContent: 'center',
              width: '70%',
            }}
            leftIcon={<Icon name="lock" size={20} color="black" />}
            ref={passwordInput}
          />

          <Button
            title="Sign in"
            raised
            onPress={handleSignIn}
            buttonStyle={{
              backgroundColor: 'dodgerblue',
            }}
            titleStyle={{
              width: '50%',
              textAlign: 'center',
            }}
          />
          <Button
            onPress={() => navigation.push('Register')}
            title="Register"
            titleStyle={{
              width: '50%',
              textAlign: 'center',
            }}
            containerStyle={{
              marginVertical: 10,
            }}
            buttonStyle={{
              borderWidth: 0.9,
              borderColor: 'dodgerblue',
            }}
            type="outline"
          />
        </KeyboardAvoidingView>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  // screenContainer: {
  // 	paddingTop: Platform.OS === "android" ? sb.currentHeight : 0,
  // 	flex: 1,
  // 	justifyContent: "center",
  // 	alignItems: "center",
  // },
  container: {
    position: 'absolute',
    width: '100%',
    // left: "30%",
    top: '30%',
  },
  formContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    zIndex: 10,
    backgroundColor: '#ffffff',
    opacity: 0.4,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '100%',
  },
});
