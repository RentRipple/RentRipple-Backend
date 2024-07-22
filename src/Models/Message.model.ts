import { Document, Schema, model } from "mongoose";
import { ObjectId } from "mongodb";

export interface IMessage extends Document {
  senderId: ObjectId;
  receiverId: ObjectId;
  message: string;
}

const messageSchema = new Schema<IMessage>(
  {
    senderId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    receiverId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
  },
  { timestamps: true },
);

const Message = model<IMessage>("Message", messageSchema);

export default Message;
