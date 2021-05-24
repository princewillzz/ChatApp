import { StatusBar } from "expo-status-bar";
import React from "react";
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

export default function RegisterScreen({ navigation }) {
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
			<View style={styles.container}>
				<KeyboardAvoidingView style={styles.formContainer}>
					<Input
						placeholder="username"
						containerStyle={{
							alignContent: "center",
							width: "70%",
						}}
						leftIcon={<Icon name="email" size={20} color="black" />}
					/>
					<Input
						placeholder="username"
						secureTextEntry
						containerStyle={{
							alignContent: "center",
							width: "70%",
						}}
						leftIcon={<Icon name="lock" size={20} color="black" />}
					/>

					<Button
						title="Register"
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
						// onPress={() => signIn({ username, password })}
						titleStyle={{
							width: "50%",
							textAlign: "center",
						}}
						type="outline"
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
});
