import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import React, { useState } from "react";

import Toast from "react-native-toast-message";
import { signinUser } from "./src/api/auth-api";
import { registerUser } from "./src/api/users-api";
import AuthContext from "./src/auth/auth";
import ChatScreen from "./src/screens/ChatScreen";
import HomeScreen from "./src/screens/HomeScreen";
import RegisterScreen from "./src/screens/RegisterScreen";
import SignInScreen from "./src/screens/SignInScreen";

const Stack = createStackNavigator();

export default function App() {
	// const [currentUserInfo] = useState({
	// 	username: "I am Master",
	// 	image: "https://picsum.photos/200/300",
	// });

	const handleStoreCurrentUserToken = async () => {};

	const [state, dispatch] = React.useReducer(
		(prevState, action) => {
			switch (action.type) {
				case "RESTORE_TOKEN":
					return {
						...prevState,
						userToken: action.token,
						isLoading: false,
					};
				case "SIGN_IN":
					return {
						...prevState,
						isSignout: false,
						userToken: action.token,
					};
				case "SIGN_OUT":
					return {
						...prevState,
						isSignout: true,
						userToken: null,
					};
			}
		},
		{
			isLoading: true,
			isSignout: false,
			userToken: null,
		}
	);

	React.useEffect(() => {
		// Fetch the token from storage then navigate to our appropriate place
		const bootstrapAsync = async () => {
			let userToken;

			try {
				userToken = null;
			} catch (e) {
				// Restoring token failed
			}

			// After restoring token, we may need to validate it in production apps

			// This will switch to the App screen or Auth screen and this loading
			// screen will be unmounted and thrown away.
			dispatch({ type: "RESTORE_TOKEN", token: userToken });
		};

		bootstrapAsync();
	}, []);

	const authContext = React.useMemo(
		() => ({
			signIn: async (siginInfo) => {
				return signinUser(siginInfo).then((responseData) => {
					console.log(responseData);
					// dispatch({ type: "SIGN_IN", token: responseData.id_token });
				});
			},
			signOut: () => dispatch({ type: "SIGN_OUT" }),
			signUp: async (userInfo) => {
				return registerUser(userInfo).then((responseDate) => {
					console.log(responseDate);
					// dispatch({ type: "SIGN_IN", token: responseDate.id_token });
				});
			},
			currentUserInfo: {
				id: "12",
				username: "I am Master",
				image: "https://picsum.photos/200/300",
			},
		}),
		[]
	);

	return (
		<AuthContext.Provider value={authContext}>
			<NavigationContainer>
				<Stack.Navigator>
					{state.userToken == null ? (
						<>
							<Stack.Screen
								name="SignIn"
								component={SignInScreen}
								options={{
									title: "Login",
									headerTitleAlign: "center",
									headerStyle: {
										backgroundColor: "dodgerblue",
									},
								}}
							/>
							<Stack.Screen
								name="Register"
								component={RegisterScreen}
								options={{
									title: "Register",
									headerTitleAlign: "center",
									headerStyle: {
										backgroundColor: "dodgerblue",
									},
								}}
							/>
						</>
					) : (
						<>
							<Stack.Screen
								name="Home"
								component={HomeScreen}
								options={{
									headerShown: false,
								}}
							/>
							<Stack.Screen
								name="Chat"
								component={ChatScreen}
								options={{
									headerShown: false,
								}}
							/>
						</>
					)}
				</Stack.Navigator>
				<Toast ref={(ref) => Toast.setRef(ref)} />
			</NavigationContainer>
		</AuthContext.Provider>
	);
}
