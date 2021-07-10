import React from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  StatusBar,
  StyleSheet,
  View,
} from 'react-native';
import {Button, Icon, Input} from 'react-native-elements';
import PhoneInput from 'react-native-phone-number-input';
import Toast from 'react-native-toast-message';
import AuthContext from '../auth/auth';

export default function SignInScreen({navigation}) {
  const [username, setUsername] = React.useState('');
  const [password, setPassword] = React.useState('');

  const [isLoading, setLoading] = React.useState(true);

  React.useEffect(() => {
    setLoading(false);
  }, []);

  const {signIn} = React.useContext(AuthContext);

  // const usernameInput = React.createRef();
  const passwordInput = React.createRef();
  const usernamePhoneInput = React.useRef(null);

  const handleSignIn = async () => {
    if (!usernamePhoneInput.current?.isValidNumber(username)) {
      console.log('Invalid nu');
      return;
    }
    if (!password) {
      passwordInput.current.shake();
      return;
    }

    setLoading(true);

    // TODO remove later on
    // const tempUsername = username.replace(
    //   `+${usernamePhoneInput.current?.getCallingCode()}`,
    //   '',
    // );
    // console.log(tempUsername);
    console.log(username, password);
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
      <StatusBar barStyle="light-content" backgroundColor="dodgerblue" />
      {isLoading && (
        <View style={[styles.loadingContainer]}>
          <ActivityIndicator size="large" color="#3178D2" />
        </View>
      )}
      <View style={styles.container}>
        <KeyboardAvoidingView style={styles.formContainer}>
          <PhoneInput
            ref={usernamePhoneInput}
            defaultValue={username}
            defaultCode={'IN'}
            onChangeFormattedText={setUsername}
            containerStyle={styles.usernamePhoneInputContainer}
            textContainerStyle={{
              borderWidth: 1,
              borderRadius: 5,
              borderColor: usernamePhoneInput.current?.isValidNumber(username)
                ? 'white'
                : 'red',
            }}
            textInputStyle={{
              minHeight: 60,
            }}
            withShadow
          />

          <Input
            placeholder="password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            containerStyle={styles.passwordInputContainer}
            inputContainerStyle={styles.passwordInputInputContainer}
            leftIcon={
              <Icon name="lock-closed" size={20} type="ionicon" color="black" />
            }
            ref={passwordInput}
            errorStyle={{display: 'none'}}
          />

          <Button
            title="Sign in"
            raised
            onPress={handleSignIn}
            buttonStyle={{
              backgroundColor: 'dodgerblue',
            }}
            titleStyle={{
              textAlign: 'center',
            }}
            containerStyle={styles.buttonContainer}
          />
          <Button
            onPress={() => navigation.push('Register')}
            title="Register"
            titleStyle={{
              // width: '50%',
              textAlign: 'center',
            }}
            containerStyle={styles.buttonContainer}
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

const widthOfEachInputBox = '75%';
const widthOfSigninRegisterBtn = '73%';

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
  usernamePhoneInputContainer: {
    alignContent: 'center',
    width: widthOfEachInputBox,
    height: 60,
    borderRadius: 10,
    marginBottom: 10,
  },
  passwordInputContainer: {
    backgroundColor: '#fff',
    alignContent: 'center',
    width: widthOfEachInputBox,
    borderRadius: 10,
    marginBottom: 20,
    elevation: 1,
  },
  passwordInputInputContainer: {
    // backgroundColor: 'red',
    height: 60,
    paddingHorizontal: 7,
    borderBottomWidth: 0,
  },
  buttonContainer: {
    width: widthOfSigninRegisterBtn,
    marginBottom: 10,
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
