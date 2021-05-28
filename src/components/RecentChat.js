import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

import { ListItem, Avatar } from "react-native-elements";

export default React.memo(({ navigation, handleOpenImageModal, userInfo }) => {
	return (
		<ListItem
			bottomDivider
			onPress={() =>
				navigation.push("Chat", {
					userInfo: userInfo,
				})
			}
		>
			<TouchableOpacity
				onPress={() => handleOpenImageModal(userInfo.image)}
			>
				<Avatar
					rounded
					source={{
						uri: userInfo?.image,
					}}
				/>
			</TouchableOpacity>
			<ListItem.Content>
				<ListItem.Title>{userInfo?.username}</ListItem.Title>
				<ListItem.Subtitle>Some chat</ListItem.Subtitle>
			</ListItem.Content>
			<ListItem.Chevron size={32} />
		</ListItem>
	);
});

const styles = StyleSheet.create({
	container: {
		height: 70,
	},
});
