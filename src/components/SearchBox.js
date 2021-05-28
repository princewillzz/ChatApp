import React, { useRef, useEffect } from "react";
import { Animated, StyleSheet, Text, TextInput, View } from "react-native";
import { Icon, SearchBar } from "react-native-elements";

export default function SearchBox({
	toggleShowSearchBox,
	seachChatText,
	handleSearchOnChange,
}) {
	const fadeAnim = useRef(new Animated.Value(0)).current;
	React.useEffect(() => {
		Animated.timing(fadeAnim, {
			toValue: 1,
			duration: 500,
			useNativeDriver: true,
		}).start();
	}, [fadeAnim]);

	return (
		<Animated.View
			style={{
				opacity: fadeAnim, // Bind opacity to animated value
			}}
		>
			<View style={styles.searchBoxContainer}>
				<Icon
					size={22}
					onPress={() => toggleShowSearchBox(false)}
					style={styles.backIcon}
					name="arrow-back"
					type="ionicon"
					color="black"
				/>
				<SearchBar
					placeholder={"I'm looking for..."}
					onChangeText={handleSearchOnChange}
					value={seachChatText}
					lightTheme
					round
					autoFocus={true}
					autoCorrect={false}
					containerStyle={styles.searchBarComponentContainer}
					style={styles.searchBarComponent}
				/>
			</View>
		</Animated.View>
	);
}

const styles = StyleSheet.create({
	container: {},
	searchBoxContainer: {
		flexDirection: "row",
		alignItems: "center",
		marginHorizontal: 5,
		backgroundColor: "#fff",
	},

	searchBarComponentContainer: {
		backgroundColor: "#fff",
		flex: 1,
	},
	searchBarComponent: {
		color: "black",
	},
	backIcon: { marginLeft: 15 },
});
