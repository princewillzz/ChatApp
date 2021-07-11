import React, {useEffect, useState} from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {Button, Icon, Input} from 'react-native-elements';
import PhoneInput from 'react-native-phone-number-input';
import Toast from 'react-native-toast-message';
import {sendOTPToVerifyNumberDuringRegistration} from '../api/auth-api';
import AuthContext from '../auth/auth';

export default function RegisterScreen({navigation}) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [rePassword, setRePassword] = useState('');

  const [isLoading, setLoading] = useState(true);

  const [isVerificationOTPSent, setIsVerificationOTPSent] = useState(false);
  const [verificationOTP, setVertificationOTP] = useState('');

  useEffect(() => {
    setLoading(false);
  }, []);

  const {signUp} = React.useContext(AuthContext);

  const [retypePasswordErrorMessage, setRetypePasswordErrorMessage] =
    useState(false);

  const rePasswordInput = React.createRef();
  const usernamePhoneInput = React.useRef(null);

  const handleShowToast = msg => {
    Toast.show({
      type: 'error',
      position: 'top',
      text1: msg,
      visibilityTime: 1000,
      autoHide: true,
    });
  };

  const validateFields = () => {
    let isValid = true;

    if (!username || !password || !rePassword) {
      isValid = false;
    } else if (
      !username.length > 0 ||
      !password.length > 0 ||
      !rePassword.length > 0 ||
      !verificationOTP.length > 0
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

  const handleSendVerificationOTP = async () => {
    if (!usernamePhoneInput.current.isValidNumber(username)) {
      handleShowToast('Mobile Number Invalid!');
      return;
    }
    // Send OTP verification
    sendOTPToVerifyNumberDuringRegistration({
      phoneNumber: username,
    })
      .then(() => {
        setIsVerificationOTPSent(true);
      })
      .catch(e => {
        console.log(e);
      });
  };

  const handleRegister = async () => {
    if (!validateFields()) {
      handleShowToast('Please fill form correctly!');
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
      verificationOTP,
      re_password: rePassword,
      country_code: usernamePhoneInput.current.getCallingCode(),
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
            onChangeFormattedText={username => {
              isVerificationOTPSent && setIsVerificationOTPSent(false);
              setUsername(username);
            }}
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
            leftIcon={
              <Icon name="lock-closed" size={20} type="ionicon" color="black" />
            }
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
            leftIcon={
              <Icon name="lock-closed" size={20} type="ionicon" color="black" />
            }
            ref={rePasswordInput}
          />

          {isVerificationOTPSent ? (
            <>
              <View style={[styles.OTPViewInputContainer]}>
                <Input
                  placeholder="OTP"
                  value={verificationOTP}
                  onChangeText={setVertificationOTP}
                  containerStyle={[styles.otpInputContainer, {width: '100%'}]}
                  inputContainerStyle={styles.otpInputInputContainer}
                  errorStyle={{display: 'none'}}
                  leftIcon={
                    <Icon
                      name="chatbox-ellipses"
                      type="ionicon"
                      size={20}
                      color="black"
                    />
                  }
                />
                <TouchableOpacity onPress={handleSendVerificationOTP}>
                  <Text style={styles.otpResendTextContainer}>Resend OTP</Text>
                </TouchableOpacity>
              </View>
              <Button
                title="Register"
                onPress={handleRegister}
                raised
                titleStyle={{textAlign: 'center'}}
                buttonStyle={{backgroundColor: 'dodgerblue'}}
                containerStyle={[styles.buttonContainer, {marginTop: 20}]}
              />
            </>
          ) : (
            <Button
              title="Send OTP"
              onPress={handleSendVerificationOTP}
              raised
              titleStyle={{textAlign: 'center'}}
              buttonStyle={{backgroundColor: 'red'}}
              containerStyle={[styles.buttonContainer, {marginTop: 20}]}
            />
          )}

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
  OTPViewInputContainer: {
    width: widthOfEachInputBox,
  },
  otpInputContainer: {
    backgroundColor: '#fff',
    alignContent: 'center',
    width: widthOfEachInputBox,
    borderRadius: 10,
    marginBottom: 10,
    elevation: 1,
  },
  otpInputInputContainer: {
    height: 60,
    paddingHorizontal: 7,
    borderBottomWidth: 0,
  },
  buttonContainer: {
    width: widthOfSigninRegisterBtn,
    marginTop: 10,
  },
  otpResendTextContainer: {
    color: 'dodgerblue',
    alignSelf: 'flex-end',
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
