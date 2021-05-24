import React, { useLayoutEffect } from "react";
import {
	FlatList,
	KeyboardAvoidingView,
	ScrollView,
	StyleSheet,
	Text,
	TextInput,
	TouchableOpacity,
	View,
} from "react-native";
import { Icon } from "react-native-elements";
import ChatScreenHeaderLeft from "../components/ChatScreenHeaderLeft";
import ChatBox from "../components/ChatBox";

export default function ChatScreen({ navigation }) {
	useLayoutEffect(() => {
		console.log("Chating screen");
		navigation.setOptions({
			headerTitle: null,
			headerStyle: { backgroundColor: "#ECECEC" },
			headerLeft: () => <ChatScreenHeaderLeft navigation={navigation} />,
		});
	}, []);

	return (
		<KeyboardAvoidingView style={styles.container}>
			<FlatList
				data={[1, 2, 9, 0 , 90]}
				renderItem={({item, index}) => <ChatBox data={item} isMe={item%2 === 0} key={index}/>}
				inverted
			/>
			<View style={styles.messageInputContainer}>
				<TextInput
					style={styles.messageInput}
					placeholder="Enter Text"
				/>
				<TouchableOpacity>
					<Icon name="send-outline" type="ionicon" />
				</TouchableOpacity>
			</View>
		</KeyboardAvoidingView>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#fff",
	},
	chatContainer: {
		backgroundColor: "red",
		flex: 1,
		// flexDirection: "column-reverse"
		// alignItems: "flex-end"
	},
	messageInputContainer: {
		// height: 50,
		flexDirection: "row",
		justifyContent: "space-between",
		paddingHorizontal: 10,
		alignItems: "center",
	},
	messageInput: {
		flexGrow: 1,
		marginRight: 10,
		padding: 10,
		height: 50,
		bottom: 0,
		borderRadius: 30,
		borderWidth: 1,
		borderColor: "transparent",
		backgroundColor: "#ECECEC",
		color: "grey",
	},
});
