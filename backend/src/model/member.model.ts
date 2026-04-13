import mongoose, { Schema, Document } from "mongoose";

export interface IMember extends Document {
  name: string;
  email: string;
  phoneNumber: string;
  membershipType: "Monthly" | "Yearly";
  status: "Active" | "Inactive";
  createdAt: Date;
}

const MemberShipSchema: Schema = new Schema({
  name: {
    type: String,
    required: [true, 'Please add a name'],
  },
  email:{
    type: String,
    required: [true, 'Please add an email'],
    unique: true,
    match: [/\S+@\S+\.\S+/, 'Please add a valid email'],
  },
  phoneNumber: {
    type: String,
    required: [true, 'Please add a phone number'],
  },
  membershipType: {
    type: String,
    enum: { values: ["monthly", "yearly"], message: 'Please select a valid membership type' },
    required: [true, 'Please add a membership type'],
  },
  status: {
    type: String,
    enum: { values: ["active", "inactive"], message: 'Please select a valid status' },
    required: [true, 'Please add a status'],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const MemberShip = mongoose.model<IMember>('MemberShip', MemberShipSchema);

export default MemberShip;