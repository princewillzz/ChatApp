import React from "react";
import {
	StyleSheet,
	Text,
	TouchableHighlight,
	TouchableOpacity,
	View,
} from "react-native";
import { Icon } from "react-native-elements";

export default function HomeHeaderRightView({ toggleShowSearchBox }) {
	return (
		<View style={styles.container}>
			<TouchableOpacity>
				<Icon
					onPress={() => toggleShowSearchBox(true)}
					style={styles.searchIcon}
					name="search-outline"
					type="ionicon"
					color="#fff"
				/>
			</TouchableOpacity>
			<TouchableOpacity>
				<Icon
					style={styles.moreIcon}
					name="ellipsis-vertical-outline"
					type="ionicon"
					color="#fff"
				/>
			</TouchableOpacity>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flexDirection: "row",
	},
	searchIcon: {
		marginRight: 5,
	},
	moreIcon: {
		marginLeft: 10,
	},
});
