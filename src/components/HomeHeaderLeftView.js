import React, { useEffect, useState } from "react";
import { Modal, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Avatar, Image } from "react-native-elements";
import ImageViewer from "react-native-image-zoom-viewer";

export default function HomeHeaderLeftView({ handleOpenImageModal, image }) {
	return (
		<>
			<View style={styles.container}>
				<TouchableOpacity onPress={() => handleOpenImageModal(image)}>
					<Avatar
						rounded
						source={{ uri: image }}
						avatarStyle={styles.avatarStyle}
					/>
				</TouchableOpacity>
				<Text style={styles.title}>Chats</Text>
			</View>
		</>
	);
}

const styles = StyleSheet.create({
	container: {
		width: "100%",
		// backgroundColor: "red",
		marginLeft: 6,
		flexDirection: "row",
		alignItems: "center",
	},
	avatarStyle: {},
	title: {
		marginLeft: 10,
		paddingLeft: 5,
		fontSize: 22,
		fontWeight: "600",
		// textTransform: "uppercase",
	},
});
