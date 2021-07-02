import React, {useEffect, useState} from 'react';
import {Text} from 'react-native';
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

export default function RegisterScreen({navigation}) {
  const [username, setUsername] = useState('8918930270');
  const [password, setPassword] = useState('pass');
  const [rePassword, setRePassword] = useState('pass');

  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(false);
  }, []);

  const {signUp} = React.useContext(AuthContext);

  const [retypePasswordErrorMessage, setRetypePasswordErrorMessage] =
    useState(false);

  const rePasswordInput = React.createRef();
  const usernamePhoneInput = React.useRef(null);

  const handleRegister = async () => {
    if (!validateFields()) {
      Toast.show({
        type: 'error',
        position: 'top',
        text1: 'Please fill form correctly!',
        visibilityTime: 1000,
        autoHide: true,
      });
      return;
    }
    if (rePassword !== password) {
      rePasswordInput.current.shake();
      return;
    }

    setLoading(true);
    const userInfo = {
      username,
      password,
    };
    signUp(userInfo).catch(e => {
      setLoading(false);
      Toast.show({
        type: 'error',
        position: 'top',
        text1: e.message,
        visibilityTime: 3000,
        autoHide: true,
      });
    });
  };

  const validateFields = () => {
    let isValid = true;

    if (!username || !password || !rePassword) {
      isValid = false;
    } else if (
      !username.length > 0 ||
      !password.length > 0 ||
      !rePassword.length > 0
    ) {
      isValid = false;
    } else if (!usernamePhoneInput?.current?.isValidNumber(username)) {
      isValid = false;
    }

    return isValid;
  };

  const handleSetRePassword = rePassword => {
    let errorMessage = false;
    if (rePassword && rePassword !== password) errorMessage = true;
    setRetypePasswordErrorMessage(errorMessage);
    setRePassword(rePassword);
  };

  const handleSetPassword = password => {
    if (rePassword) {
      if (rePassword === password) setRetypePasswordErrorMessage(false);
      else setRetypePasswordErrorMessage(true);
    }
    setPassword(password);
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
            autoFocus
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
            onChangeText={handleSetPassword}
            secureTextEntry
            containerStyle={styles.passwordInputContainer}
            inputContainerStyle={styles.passwordInputInputContainer}
            errorStyle={{display: 'none'}}
            leftIcon={<Icon name="lock" size={20} color="black" />}
          />

          <Input
            placeholder="Re-Type password"
            value={rePassword}
            onChangeText={handleSetRePassword}
            secureTextEntry
            containerStyle={[
              styles.passwordInputContainer,
              {
                borderWidth: 1,
                borderColor: retypePasswordErrorMessage ? 'red' : '#fff',
              },
            ]}
            inputContainerStyle={styles.passwordInputInputContainer}
            errorStyle={{display: 'none'}}
            leftIcon={<Icon name="lock" size={20} color="black" />}
            ref={rePasswordInput}
          />

          <Button
            title="Register"
            onPress={handleRegister}
            raised
            titleStyle={{textAlign: 'center'}}
            buttonStyle={{backgroundColor: 'dodgerblue'}}
            containerStyle={[styles.buttonContainer, {marginTop: 20}]}
          />
          <Button
            onPress={() => navigation.navigate('SignIn')}
            title="Sign in"
            titleStyle={{textAlign: 'center'}}
            type="outline"
            buttonStyle={{
              borderWidth: 0.9,
              borderColor: 'dodgerblue',
            }}
            containerStyle={styles.buttonContainer}
          />
        </KeyboardAvoidingView>
      </View>
    </>
  );
}

const widthOfEachInputBox = '80%';
const widthOfSigninRegisterBtn = '78%';

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
    marginBottom: 10,
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
    marginTop: 10,
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
