import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

import { ListItem, Avatar } from "react-native-elements";

export default function RecentChat({ navigation }) {
	return (
		<ListItem bottomDivider onPress={() => navigation.push("Chat")}>
			<TouchableOpacity>
				<Avatar
					rounded
					source={{ uri: "https://picsum.photos/200/300" }}
				/>
			</TouchableOpacity>
			<ListItem.Content>
				<ListItem.Title>Harsh</ListItem.Title>
				<ListItem.Subtitle>Some chat</ListItem.Subtitle>
			</ListItem.Content>
			<ListItem.Chevron size={32} />
		</ListItem>
	);
}

const styles = StyleSheet.create({
	container: {
		height: 70,
	},
});
