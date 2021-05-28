import React from "react";
import {
	StyleSheet,
	Text,
	TouchableHighlight,
	TouchableOpacity,
	View,
} from "react-native";
import { Icon } from "react-native-elements";

export default function HomeHeaderRightView({
	toggleShowSearchBox,
	showSearchBox,
}) {
	return (
		<View style={styles.container}>
			<TouchableOpacity>
				<Icon
					onPress={() => toggleShowSearchBox(!showSearchBox)}
					style={styles.searchIcon}
					name="search-outline"
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
	},
	searchIcon: {
		marginRight: 5,
	},
	moreIcon: {
		marginLeft: 10,
	},
});
