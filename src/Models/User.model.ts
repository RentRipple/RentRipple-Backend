import mongoose, { Document, Schema } from "mongoose";
import { predefinedQuestions } from "../Helpers/constants";
import bcrypt from "bcryptjs";
import moment from "moment";

interface ISecurityQuestion {
  question: string;
  answer: string;
}

interface Location {
  address_line1: string;
  city: string;
  country: string;
}

export interface IUser extends Document {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  securityQuestions: ISecurityQuestion[];
  gender: string;
  number: string;
  rating: number;
  profilePicture: string;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
  online?: boolean;
  address: string;
  birthDate: string; // Change to string to store formatted date
  propertyDetails: mongoose.Schema.Types.ObjectId;
  rentalHistory: Location[];
  preferredLocation: Location[];
  checkPassword(password: string): Promise<boolean>;
  checkSecurityAnswer(question: string, answer: string): Promise<boolean>;
}

const SecurityQuestionSchema: Schema = new Schema({
  question: { type: String, required: true, enum: predefinedQuestions },
  answer: { type: String, required: true },
});

const LocationSchema: Schema = new Schema({
  address_line1: { type: String, required: true, default: "Default Address" },
  city: { type: String, required: true, default: "Default City" },
  country: { type: String, required: true, default: "Default Country" },
});

const UserSchema: Schema<IUser> = new Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, lowercase: true, unique: true },
  password: { type: String, required: true },
  securityQuestions: {
    type: [SecurityQuestionSchema],
    validate: {
      validator: (arr: ISecurityQuestion[]) => arr.length === 3,
      message: "{PATH} must have exactly 3 elements",
    },
  },
  gender: { type: String, required: true },
  number: { type: String, required: true },
  rating: { type: Number, default: 2 },
  profilePicture: { type: String, default: "" },
  isDeleted: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  address: { type: String, default: "" },
  birthDate: {
    type: String,
    default: () => moment().format("YYYY-MM-DD"),
    set: (value: Date) => moment(value).format("YYYY-MM-DD"),
  },
  propertyDetails: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Property",
  },
  rentalHistory: {
    type: [LocationSchema],
    default: [
      {
        address_line1: "300 Ouellette",
        city: "Windsor",
        country: "Canada",
      },
    ],
  },
  preferredLocation: {
    type: [LocationSchema],
    default: [
      {
        address_line1: "Sunset Avenue",
        city: "Windsor",
        country: "Canada",
      },
    ],
  },
});

UserSchema.pre<IUser>("save", async function (next) {
  try {
    if (!this.isModified("password")) {
      return next();
    }
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(this.password, salt);
    this.password = hash;
    next();
  } catch (error: any) {
    next(error);
  }
});

UserSchema.methods.checkPassword = async function (
  password: string,
): Promise<boolean> {
  return await bcrypt.compare(password, this.password);
};

UserSchema.methods.checkSecurityAnswer = async function (
  question: string,
  answer: string,
) {
  const sq = this.securityQuestions.find(
    (q: ISecurityQuestion) => q.question === question,
  );
  if (!sq) return false;
  return sq.answer === answer;
};

export const User = mongoose.model<IUser>("User", UserSchema);
