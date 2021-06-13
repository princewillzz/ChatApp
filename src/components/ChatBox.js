import {StyleSheet, Text, View} from 'react-native';

import React, {PureComponent} from 'react';

export default class ChatBox extends PureComponent {
  render() {
    // console.log('hi', this.props.data.uid);
    return (
      <View style={this.props.isMe ? styles.sentBox : styles.receivedBox}>
        <Text>{this.props.data.textMessage}</Text>
        <Text style={styles.time}>{`${(
          '0' + this.props.data.timestamp.getHours()
        ).slice(-2)}:${('0' + this.props.data.timestamp.getMinutes()).slice(
          -2,
        )}`}</Text>
      </View>
    );
  }
}

// export default function ChatBox({isMe, data}) {
//   React.useEffect(() => {
//     console.log('useeffect');
//   }, []);
//   console.log('hi', data.uid);
//   return (
//     <View style={isMe ? styles.sentBox : styles.receivedBox}>
//       <Text>{data.textMessage}</Text>
//       <Text style={styles.time}>{`${('0' + data.timestamp.getHours()).slice(
//         -2,
//       )}:${('0' + data.timestamp.getMinutes()).slice(-2)}`}</Text>
//     </View>
//   );
// }

const styles = StyleSheet.create({
  receivedBox: {
    maxWidth: '70%',
    backgroundColor: 'dodgerblue',
    marginVertical: 7,
    flex: 1,
    alignSelf: 'flex-start',
    padding: 12,
    marginHorizontal: 5,
    borderRadius: 20,
    // flexDirection: "row-reverse"
  },
  sentBox: {
    maxWidth: '70%',
    backgroundColor: 'pink',
    marginVertical: 7,
    flex: 1,
    alignSelf: 'flex-end',
    padding: 12,
    marginHorizontal: 5,
    borderRadius: 20,
  },
  time: {
    alignSelf: 'flex-end',
    color: 'black',
    fontSize: 12,
  },
});
