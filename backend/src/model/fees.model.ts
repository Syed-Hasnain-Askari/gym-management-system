import mongoose, { Schema, Document, Types } from "mongoose";

export interface IFees extends Document {
	userId: Types.ObjectId;
	month:
		| "January"
		| "February"
		| "March"
		| "April"
		| "May"
		| "June"
		| "July"
		| "August"
		| "September"
		| "October"
		| "November"
		| "December";
	feeStatus: "paid" | "unpaid";
	amount: 1500 | 15000;
	createdAt: Date;
}

const FeesSchema: Schema = new Schema({
	userId: {
		type: Types.ObjectId,
		ref: "MemberShip",
		required: true
	},
	month: {
		type: String,
		enum: {
			values: [
				"January",
				"February",
				"March",
				"April",
				"May",
				"June",
				"July",
				"August",
				"September",
				"October",
				"November",
				"December"
			],
			message: "Please select a valid month"
		},
		required: [true, "Please add a month"]
	},
	amount: {
		type: Number,
		enum: {
			values: [1500, 15000],
			message: "Please select a valid amount"
		},
		required: [true, "Please add an amount"]
	},
	feeStatus: {
		type: String,
		enum: {
			values: ["paid", "unpaid"],
			message: "Please select a valid status"
		},
		default: "unpaid",
		required: [true, "Please add a feeStatus"]
	},
	createdAt: {
		type: Date,
		default: Date.now
	}
});

const Fees = mongoose.model<IFees>("Fees", FeesSchema);

export default Fees;
