import React, { useLayoutEffect } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { Image, Button, Header, Icon, Input } from "react-native-elements";
import HomeHeaderLeftView from "../components/HomeHeaderLeftView";
import HomeHeaderRightView from "../components/HomeHeaderRightView";
import RecentChat from "../components/RecentChat";

export default function HomeScreen({ navigation }) {
	useLayoutEffect(() => {
		navigation.setOptions({
			title: "CHITCHAT",
			headerStyle: { backgroundColor: "#fff" },
			headerTitleStyle: {
				color: "black",
				fontSize: 15,
			},
			headerTintColor: "black",
			headerLeft: () => <HomeHeaderLeftView />,
			headerRight: () => <HomeHeaderRightView />,
		});
	}, []);

	return (
		<>
			<ScrollView style={styles.container}>
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
});
