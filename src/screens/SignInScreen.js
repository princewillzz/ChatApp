import { StatusBar } from "expo-status-bar";
import React, { useLayoutEffect } from "react";
import { KeyboardAvoidingView, StyleSheet, View } from "react-native";
import {
	Image,
	Text,
	Button,
	Header,
	Icon,
	Input,
} from "react-native-elements";
import AuthContext from "../auth/auth";

export default function SignInScreen({ navigation }) {
	const [username, setUsername] = React.useState("");
	const [password, setPassword] = React.useState("");

	const { signIn } = React.useContext(AuthContext);

	// useLayoutEffect(() => {
	//     navigation.op
	// }, [])

	return (
		<>
			<StatusBar />
			{/* <Header
				backgroundColor="silver"
				centerComponent={{
					text: "Login",
					style: { color: "black", fontSize: 20 },
				}}
			/> */}

			<View style={styles.container}>
				<KeyboardAvoidingView style={styles.formContainer}>
					<Input
						placeholder="username"
						value={username}
						onChangeText={setUsername}
						containerStyle={{
							alignContent: "center",
							width: "70%",
						}}
						leftIcon={<Icon name="email" size={20} color="black" />}
					/>
					<Input
						placeholder="username"
						value={password}
						onChangeText={setPassword}
						secureTextEntry
						containerStyle={{
							alignContent: "center",
							width: "70%",
						}}
						leftIcon={<Icon name="lock" size={20} color="black" />}
					/>

					<Button
						title="Sign in"
						raised
						onPress={() => signIn({ username, password })}
						buttonStyle={{
							backgroundColor: "dodgerblue",
						}}
						titleStyle={{
							width: "50%",
							textAlign: "center",
						}}
					/>
					<Button
						onPress={() => navigation.push("Register")}
						title="Register"
						titleStyle={{
							width: "50%",
							textAlign: "center",
						}}
						containerStyle={{
							marginVertical: 10,
						}}
						type="outline"
					/>
				</KeyboardAvoidingView>
			</View>
		</>
	);
}

const styles = StyleSheet.create({
	// screenContainer: {
	// 	paddingTop: Platform.OS === "android" ? sb.currentHeight : 0,
	// 	flex: 1,
	// 	justifyContent: "center",
	// 	alignItems: "center",
	// },
	container: {
		position: "absolute",
		width: "100%",
		// left: "30%",
		top: "30%",
	},
	formContainer: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
	},
});
