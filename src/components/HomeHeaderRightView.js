import React from "react";
import {
	StyleSheet,
	Text,
	TouchableHighlight,
	TouchableOpacity,
	View,
} from "react-native";
import { Icon } from "react-native-elements";

export default function HomeHeaderRightView() {
	return (
		<View style={styles.container}>
			<TouchableOpacity>
				<Icon
					style={styles.searchIcon}
					name="search-outline"
					type="ionicon"
				/>
			</TouchableOpacity>
			<TouchableOpacity>
				<Icon name="ellipsis-vertical-outline" type="ionicon" />
			</TouchableOpacity>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		marginRight: 10,
		flexDirection: "row",
	},
	searchIcon: {
		marginRight: 5,
	},
});
