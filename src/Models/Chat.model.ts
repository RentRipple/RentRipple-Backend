import mongoose, { Document, Schema, Model } from "mongoose";

interface IChat extends Document {
  sender: string;
  receiver: string;
  message: string;
  typing: boolean;
  read: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ChatSchema: Schema<IChat> = new Schema(
  {
    sender: {
      type: String,
      required: [true, "Please provide a sender"],
    },
    receiver: {
      type: String,
      required: [true, "Please provide a receiver"],
    },
    message: {
      type: String,
      required: [true, "Please provide a message"],
    },
    typing: {
      type: Boolean,
      default: false,
    },
    read: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

const Chat: Model<IChat> =
  mongoose.models.chats || mongoose.model<IChat>("chats", ChatSchema);

export default Chat;
