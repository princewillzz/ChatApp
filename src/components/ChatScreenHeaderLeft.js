import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Avatar, Icon } from "react-native-elements";

export default function ChatScreenHeaderLeft({ navigation }) {
	return (
		<View style={styles.container}>
			<TouchableOpacity
				style={styles.backArrow}
				onPress={() => navigation.pop()}
			>
				<Icon name="arrow-back-outline" type="ionicon" />
			</TouchableOpacity>
			<TouchableOpacity style={styles.chatingWithAvatar}>
				<Avatar
					rounded
					source={{ uri: "https://picsum.photos/200/300" }}
				/>
				<Text style={styles.chatWithName}>Harsh</Text>
			</TouchableOpacity>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		// marginLeft: 16,
		flexDirection: "row",
		alignItems: "center",
	},
	chatingWithAvatar: {
		marginLeft: 10,
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "flex-start",
	},

	chatWithName: {
		marginLeft: 10,
		fontSize: 17,
	},
});
