import mongoose, { Schema, Document } from "mongoose";

export interface IMember extends Document {
	name: string;
	email: string;
	phone: string;
	createdAt: Date;
}

const MemberSchema: Schema = new Schema(
	{
		name: {
			type: String,
			required: [true, "Please add a name"]
		},
		email: {
			type: String,
			required: [true, "Please add an email"],
			unique: true,
			match: [/\S+@\S+\.\S+/, "Please add a valid email"]
		},
		phone: {
			type: String
		}
	},
	{ timestamps: true }
);

const Member = mongoose.model<IMember>("Member", MemberSchema);

export default Member;
