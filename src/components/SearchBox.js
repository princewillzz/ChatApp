import React from "react";
import { Animated, StyleSheet, Text, TextInput, View } from "react-native";
import { Icon } from "react-native-elements";

export default function SearchBox({ toggleShowSearchBox }) {
	return (
		<Animated.View style={styles.container}>
			<View style={styles.searchBoxContainer}>
				<Icon
					onPress={() => toggleShowSearchBox(false)}
					style={styles.backIcon}
					name="arrow-back"
					type="ionicon"
					color="black"
				/>
				<Icon
					size={18}
					style={styles.searchIcon}
					name="search-outline"
					type="ionicon"
					color="black"
				/>
				<TextInput
					multiline
					style={{
						color: "#999",
						width: "100%",
					}}
					autoFocus={true}
					placeholder={"I'm looking for..."}
					placeholderTextColor={"#999"}
					autoCorrect={false}
				/>
			</View>
		</Animated.View>
	);
}

const styles = StyleSheet.create({
	container: {
		position: "absolute",
		top: 30,
		left: 10,
		width: "95%",
		backgroundColor: "#fff",
	},
	searchBoxContainer: {
		flexDirection: "row",
		alignItems: "center",
		height: 40,
		marginHorizontal: 5,
	},
	backIcon: {},
	searchIcon: {
		marginLeft: 5,
		marginRight: 10,
	},
});
