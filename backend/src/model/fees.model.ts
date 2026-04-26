import mongoose, { Schema, Document, Types } from "mongoose";

export interface IFees extends Document {
	_id: Types.ObjectId;
	userId: Types.ObjectId;
	dueDate: Date;
	feeStatus: "paid" | "unpaid";
	amount: 1500 | 15000;
	createdAt: Date;
}

const FeesSchema: Schema = new Schema(
	{
		userId: {
			type: Types.ObjectId,
			ref: "MemberShip",
			required: true
		},
		dueDate: {
			type: Date,
			required: [true, "Please add a due date"],
			validate: {
				validator: function (value: Date) {
					const now = new Date();
					const due = new Date(value);

					// Must not be a future month beyond current month
					return (
						due.getFullYear() < now.getFullYear() ||
						(due.getFullYear() === now.getFullYear() &&
							due.getMonth() <= now.getMonth())
					);
				},
				message: "Due date cannot be a future month"
			}
		},
		amount: {
			type: Number,
			enum: {
				values: [1500, 15000],
				message: "Amount must be 1500 (monthly) or 15000 (yearly)"
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
		}
	},
	{
		timestamps: true // handles createdAt and updatedAt automatically
	}
);

// Prevent duplicate fee for same membership in same month
FeesSchema.index(
	{
		userId: 1,
		dueDate: 1
	},
	{
		unique: true,
		partialFilterExpression: {
			dueDate: { $exists: true }
		}
	}
);

// Virtual to get month name from dueDate
FeesSchema.virtual("month").get(function () {
	return this.dueDate.toLocaleString("default", { month: "long" });
});

const Fees = mongoose.model<IFees>("Fees", FeesSchema);

export default Fees;
