import mongoose, { Document, Schema } from "mongoose";
import bcrypt from "bcryptjs";

interface ISecurityQuestion {
  question: string;
  answer: string;
}

interface IUser extends Document {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  securityQuestions: ISecurityQuestion[];
  gender: string;
  number: string;
  checkPassword(password: string): Promise<boolean>;
  checkSecurityAnswer(question: string, answer: string): Promise<boolean>;
}

const predefinedQuestions = [
  "What was your childhood nickname?",
  "What is the name of your favorite childhood friend?",
  "In what city or town did your mother and father meet?",
  "What is your favorite team?",
  "What is your favorite movie?",
  "What was the name of your first pet?",
];

const SecurityQuestionSchema: Schema = new Schema({
  question: { type: String, required: true, enum: predefinedQuestions },
  answer: { type: String, required: true },
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
