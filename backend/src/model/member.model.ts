import mongoose, { Schema, Document } from "mongoose";

export interface IMember extends Document {
	name: string;
	email: string;
	phoneNumber: string;
	membershipType: "Monthly" | "Yearly";
	status: "Active" | "Inactive";
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
		phoneNumber: {
			type: String
		}
	},
	{ timestamps: true }
);

const Member = mongoose.model<IMember>("Member", MemberSchema);

export default Member;
