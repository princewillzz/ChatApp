import { StatusBar } from "expo-status-bar";
import React, { useLayoutEffect, useState } from "react";
import {
	Animated,
	ScrollView,
	StyleSheet,
	Text,
	TextInput,
	TouchableHighlight,
	View,
} from "react-native";
import { Image, Button, Header, Icon, Input } from "react-native-elements";
import HomeHeaderLeftView from "../components/HomeHeaderLeftView";
import HomeHeaderRightView from "../components/HomeHeaderRightView";
import RecentChat from "../components/RecentChat";
import SearchBox from "../components/SearchBox";

export default function HomeScreen({ navigation }) {
	const [showSearchBox, setShowSearchBox] = useState(false);

	const toggleShowSearchBox = (state) => {
		if (showSearchBox !== state) {
			setShowSearchBox(state);
		}
	};

	return (
		<>
			<Header
				containerStyle={{
					backgroundColor: "dodgerblue",
				}}
				leftComponent={<HomeHeaderLeftView />}
				rightComponent={
					<HomeHeaderRightView
						toggleShowSearchBox={toggleShowSearchBox}
					/>
				}
			/>

			{showSearchBox && (
				<SearchBox toggleShowSearchBox={toggleShowSearchBox} />
			)}

			<ScrollView
				style={styles.container}
				onTouchStart={() => toggleShowSearchBox(false)}
			>
				<View style={styles.recentChats}>
					<RecentChat navigation={navigation} />
					<RecentChat navigation={navigation} />
					<RecentChat navigation={navigation} />
					<RecentChat navigation={navigation} />
					<RecentChat navigation={navigation} />
					<RecentChat navigation={navigation} />
					<RecentChat navigation={navigation} />
					<RecentChat navigation={navigation} />
				</View>
			</ScrollView>
		</>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#fff",
	},
	recentChats: {
		flex: 1,
		// backgroundColor: "blue",
		// flexDirection: "column",
	},
	searchBarContainer: {
		elevation: 30,
		top: 0,
	},
	searchBar: {
		width: "95%",
		alignSelf: "center",
		height: 40,
		borderRadius: 10,
		// backgroundColor: "silver",
	},
});
