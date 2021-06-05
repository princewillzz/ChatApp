import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState } from "react";
import { ActivityIndicator } from "react-native";
import { KeyboardAvoidingView, StyleSheet, View } from "react-native";
import {
	Image,
	Text,
	Button,
	Header,
	Icon,
	Input,
} from "react-native-elements";
import Toast from "react-native-toast-message";
import AuthContext from "../auth/auth";

export default function RegisterScreen({ navigation }) {
	const [username, setUsername] = useState();
	const [password, setPassword] = useState();
	const [rePassword, setRePassword] = useState();

	const [isLoading, setLoading] = useState(true);

	useEffect(() => {
		setLoading(false);
	}, []);

	const { signUp } = React.useContext(AuthContext);

	const [retypePasswordErrorMessage, setRetypePasswordErrorMessage] =
		useState("");

	const rePasswordInput = React.createRef();

	const handleRegister = async () => {
		if (!validateFields()) {
			Toast.show({
				type: "error",
				position: "top",
				text1: "Please fill form correctly!",
				visibilityTime: 1000,
				autoHide: true,
			});
			return;
		}
		if (rePassword !== password) {
			rePasswordInput.current.shake();
			return;
		}

		setLoading(true);
		const userInfo = {
			username,
			password,
		};
		signUp(userInfo)
			.then(() => console.log("Register complete"))
			.catch((e) => {
				Toast.show({
					type: "error",
					position: "top",
					text1: e.message,
					visibilityTime: 3000,
					autoHide: true,
				});
			})
			.finally(() =>
				setTimeout(() => {
					setLoading(false);
				}, 500)
			);
	};

	const validateFields = () => {
		let isValid = true;

		if (!username || !password || !rePassword) {
			isValid = false;
		} else if (
			!username.length > 0 ||
			!password.length > 0 ||
			!rePassword.length > 0
		) {
			isValid = false;
		}

		return isValid;
	};

	const handleSetRePassword = (rePassword) => {
		let errorMessage = "";
		if (rePassword && rePassword !== password)
			errorMessage = "Password Not Matching";
		setRetypePasswordErrorMessage(errorMessage);
		setRePassword(rePassword);
	};

	return (
		<>
			<StatusBar />
			{/* <Header
				backgroundColor="silver"
				leftComponent={{
					icon: "arrow-left",
					color: "#fff",
					onPress: () => navigation.pop(),
				}}
				centerComponent={{
					text: "Register",
					style: { color: "black", fontSize: 20 },
				}}
			/> */}

			{isLoading && (
				<View style={[styles.loadingContainer]}>
					<ActivityIndicator size="large" color="#3178D2" />
				</View>
			)}
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
						leftIcon={
							<Icon
								name="person-circle-outline"
								size={22}
								color="black"
								type="ionicon"
							/>
						}
					/>
					<Input
						placeholder="password"
						value={password}
						onChangeText={setPassword}
						secureTextEntry
						containerStyle={{
							alignContent: "center",
							width: "70%",
						}}
						leftIcon={<Icon name="lock" size={20} color="black" />}
					/>

					<Input
						placeholder="Re-Type password"
						value={rePassword}
						onChangeText={handleSetRePassword}
						secureTextEntry
						containerStyle={{
							alignContent: "center",
							width: "70%",
						}}
						leftIcon={<Icon name="lock" size={20} color="black" />}
						errorStyle={{ color: "red" }}
						errorMessage={retypePasswordErrorMessage}
						ref={rePasswordInput}
					/>

					<Button
						title="Register"
						onPress={handleRegister}
						raised
						titleStyle={{
							width: "50%",
							textAlign: "center",
						}}
						containerStyle={{
							marginVertical: 10,
						}}
						buttonStyle={{
							backgroundColor: "dodgerblue",
						}}
					/>
					<Button
						onPress={() => navigation.navigate("SignIn")}
						title="Sign in"
						titleStyle={{
							width: "50%",
							textAlign: "center",
						}}
						type="outline"
						buttonStyle={{
							borderWidth: 0.7,
							borderColor: "dodgerblue",
						}}
					/>
				</KeyboardAvoidingView>
			</View>
		</>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	formContainer: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
	},
	loadingContainer: {
		position: "absolute",
		top: 0,
		left: 0,
		zIndex: 10,
		backgroundColor: "#ffffff",
		opacity: 0.4,
		justifyContent: "center",
		alignItems: "center",
		width: "100%",
		height: "100%",
	},
});
