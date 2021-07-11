import {BackHandler, Linking, PermissionsAndroid} from 'react-native';

export const handleGiveContactPermission = async () => {
  PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.READ_CONTACTS, {
    title: 'UntangledChat Contacts Permission',
    message:
      'UntangledChat needs to sync your contacts. ' +
      'We do not store your contacts.',
    // buttonNeutral: 'Ask Me Later',
    buttonPositive: 'OK',
  }).then(granted => {
    if (PermissionsAndroid.RESULTS.GRANTED === granted) {
    } else {
      BackHandler.exitApp();
      Linking.openSettings();
    }
  });
};
