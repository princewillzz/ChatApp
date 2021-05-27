import { StatusBar } from "expo-status-bar";
import React, { useCallback, useLayoutEffect, useState } from "react";
import {
	Animated,
	FlatList,
	ScrollView,
	StyleSheet,
	Text,
	TextInput,
	TouchableHighlight,
	View,
} from "react-native";
import { Image, Button, Header, Icon, Input } from "react-native-elements";
import AuthContext from "../auth/auth";
import HomeHeaderLeftView from "../components/HomeHeaderLeftView";
import HomeHeaderRightView from "../components/HomeHeaderRightView";
import ImageModal from "../components/ImageModal";
import RecentChat from "../components/RecentChat";
import SearchBox from "../components/SearchBox";

const users = [
	{
		id: Math.floor(Math.random() * 10000).toString(),
		image: `https://source.unsplash.com/random/300x200?sig=${Math.floor(
			Math.random() * 100
		)}`,
		username: "Harsh",
	},
	{
		id: Math.floor(Math.random() * 10000).toString(),
		image: `https://source.unsplash.com/random/300x200?sig=${Math.floor(
			Math.random() * 100
		)}`,
		username: "Utkarsh",
	},
	{
		id: Math.floor(Math.random() * 10000).toString(),
		image: `https://source.unsplash.com/random/300x200?sig=${Math.floor(
			Math.random() * 100
		)}`,
		username: "Lal babu",
	},
	{
		id: Math.floor(Math.random() * 10000).toString(),
		image: `https://source.unsplash.com/random/300x200?sig=${Math.floor(
			Math.random() * 100
		)}`,
		username: "Animesh",
	},
];

export default function HomeScreen({ navigation }) {
	const { currentUserInfo } = React.useContext(AuthContext);

	const [showSearchBox, setShowSearchBox] = useState(false);

	// Zoom on the profile picture of all your contact
	const [imageToBeShownOnModal, setImageToBeShownOnModal] = useState(null);
	const [showImageModal, setShowImageModal] = useState(false);

	const handleCloseImageModal = useCallback(
		() => setShowImageModal(false),
		[]
	);
	const handleOpenImageModal = useCallback((image) => {
		setShowImageModal(true);
		setImageToBeShownOnModal(image);
	}, []);

	// Search box
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
				leftComponent={
					<HomeHeaderLeftView
						image={currentUserInfo.image}
						handleOpenImageModal={handleOpenImageModal}
					/>
				}
				rightComponent={
					<HomeHeaderRightView
						toggleShowSearchBox={toggleShowSearchBox}
					/>
				}
			/>

			{showSearchBox && (
				<SearchBox toggleShowSearchBox={toggleShowSearchBox} />
			)}

			<View
				style={styles.container}
				onTouchStart={() => toggleShowSearchBox(false)}
			>
				{/* <View style={styles.recentChats}> */}
				<FlatList
					style={styles.recentChats}
					data={users}
					renderItem={({ item }) => (
						<RecentChat
							handleOpenImageModal={handleOpenImageModal}
							navigation={navigation}
							userInfo={item}
							key={item.id}
						/>
					)}
					keyExtractor={(_) => _.id}
				/>
			</View>

			<ImageModal
				images={{ uri: imageToBeShownOnModal }}
				showImageModal={showImageModal}
				handleOpenImageModal={handleOpenImageModal}
				handleCloseImageModal={handleCloseImageModal}
			/>
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
