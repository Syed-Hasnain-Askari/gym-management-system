import mongoose, {
	Schema,
	Document,
	Types,
	mongoosePopulatedDocumentMarker
} from "mongoose";
import { ref } from "node:process";

export interface IMemberShip extends Document {
	memberId: Types.ObjectId;
	paymentId: string;
	plain: string;
	status: "active" | "inactive";
	startDate: Date;
	endDate: Date;
}

const MembershipSchema: Schema = new Schema({
	memberId: {
		type: Types.ObjectId,
		ref: "Member",
		required: true
	},
	paymentId: {
		type: String,
		required: true
	},
	plain: {
		type: String,
		enum: {
			values: ["monthly", "yearly"],
			message: "Please select a valid membership type"
		},
		required: true
	},
	status: {
		type: String,
		enum: {
			values: ["active", "inactive"],
			message: "Please select a valid status"
		},
		default: "inactive",
		required: [true, "Please add a status"]
	},
	startDate: {
		type: Date,
		default: Date.now
	},
	endDate: {
		type: Date,
		default: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days
	}
});

const Membership = mongoose.model<IMemberShip>("Membership", MembershipSchema);

export default Membership;
