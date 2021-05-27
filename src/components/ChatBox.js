import React from "react";
import { StyleSheet, Text, View } from "react-native";

export default function ChatBox({ isMe, data }) {
	return (
		<View style={isMe ? styles.sentBox : styles.receivedBox}>
			<Text>{data.textMessage}</Text>
			<Text style={styles.time}>{data.time}</Text>
		</View>
	);
}

const styles = StyleSheet.create({
	receivedBox: {
		maxWidth: "40%",
		backgroundColor: "dodgerblue",
		marginVertical: 7,
		flex: 1,
		alignSelf: "flex-start",
		padding: 12,
		marginHorizontal: 5,
		borderRadius: 20,
		// flexDirection: "row-reverse"
	},
	sentBox: {
		maxWidth: "40%",
		backgroundColor: "pink",
		marginVertical: 7,
		flex: 1,
		alignSelf: "flex-end",
		padding: 12,
		marginHorizontal: 5,
		borderRadius: 20,
	},
	time: {
		alignSelf: "flex-end",
		color: "black",
		fontSize: 12,
	},
});
