const MyUserSchema = "MyUserSchema";

export const MyUserSchema = {
	name: MyUserSchema,
	properties: {
		_id: "int",
		token: "string",
		status: "string?",
	},
	primaryKey: "_id",
};
