import React from 'react';
import {Modal, Pressable, StyleSheet, Text, View} from 'react-native';
import {Icon} from 'react-native-elements';

const CustomSyncInfoModal = ({visible}) => {
  const [open, setOpen] = React.useState(false);

  React.useEffect(() => {
    if (visible) setOpen(visible);
  }, [visible]);

  return (
    <Modal visible={open} animationType="slide" transparent={true}>
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <View style={styles.modalContentText}>
            <Text style={styles.modalText}>
              {visible ? 'Syncing...' : 'Successfully synced'}
            </Text>
            <Icon name="cloud-download-outline" type="ionicon" />
          </View>
          {/* <Button></Button> */}
          {!visible && (
            <Pressable
              style={[styles.button, styles.buttonClose]}
              onPress={() => setOpen(!open)}>
              <Text style={styles.textStyle}>Close</Text>
            </Pressable>
          )}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalContentText: {
    flexDirection: 'row',
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
    width: 100,
  },
  buttonOpen: {
    backgroundColor: '#F194FF',
  },
  buttonClose: {
    backgroundColor: '#2196F3',
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    fontSize: 16,
    marginBottom: 15,
    marginRight: 10,
    textAlign: 'center',
  },
});

export default CustomSyncInfoModal;
