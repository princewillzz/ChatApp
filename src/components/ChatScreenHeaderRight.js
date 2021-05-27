import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Icon } from "react-native-elements";

export default function ChatScreenHeaderRight() {
	return (
		<View style={styles.container}>
			<TouchableOpacity>
				<Icon
					size={26}
					style={styles.videoIcon}
					name="videocam-outline"
					type="ionicon"
				/>
			</TouchableOpacity>
			<TouchableOpacity>
				<Icon
					style={styles.moreIcon}
					name="ellipsis-vertical-outline"
					type="ionicon"
				/>
			</TouchableOpacity>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flexDirection: "row",
		alignItems: "center",
	},
	videoIcon: {
		marginRight: 10,
	},
	moreIcon: {},
});
