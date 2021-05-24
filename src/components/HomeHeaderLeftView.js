import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Avatar } from "react-native-elements";

export default function HomeHeaderLeftView() {
	return (
		<View style={styles.container}>
			<TouchableOpacity>
				<Avatar
					rounded
					source={{ uri: "https://picsum.photos/200/300" }}
					avatarStyle={styles.avatarStyle}
				/>
			</TouchableOpacity>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		marginLeft: 16,
		flexDirection: "row",
		alignItems: "center",
	},
	avatarStyle: {},
	title: {
		marginLeft: 5,
		paddingLeft: 5,
		fontSize: 16,
		fontWeight: "600",
		textTransform: "uppercase",
	},
});
