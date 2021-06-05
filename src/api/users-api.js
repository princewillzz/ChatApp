import { baseURL } from "../../config";

export const registerUser = async (userInfo) => {
	const URI = `${baseURL}/auth/users/register`;
	return fetch(URI, {
		method: "POST",
		headers: {
			Accept: "application/json",
			"Content-Type": "application/json",
		},
		body: JSON.stringify(userInfo),
	})
		.then((res) => {
			if (res.ok || res.status === 400) {
				return res.json();
				// throw new Error("User already exists");
			} else {
				throw new Error("Unable to register user!!");
			}
		})
		.then((jsonData) => {
			if (jsonData?.status === 400) throw new Error(jsonData.message);
			else return jsonData;
		});
};
