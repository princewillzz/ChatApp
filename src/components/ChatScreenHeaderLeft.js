import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Avatar, Icon } from "react-native-elements";

export default function ChatScreenHeaderLeft({
	navigation,
	handleOpenImageModal,
	userImage,
}) {
	return (
		<View style={styles.container}>
			<TouchableOpacity
				style={styles.backArrow}
				onPress={() => navigation.pop()}
			>
				<Icon name="arrow-back-outline" type="ionicon" />
			</TouchableOpacity>
			<TouchableOpacity
				style={styles.chatingWithAvatar}
				onPress={handleOpenImageModal}
			>
				<Avatar rounded source={{ uri: userImage }} />
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
