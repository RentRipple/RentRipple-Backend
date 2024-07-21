import mongoose, { Document, Schema, Model } from "mongoose";

// Interface for DeletedMessage
export interface IDeletedMessage extends Document {
  userID: mongoose.Types.ObjectId;
  deletedMessageofThisUser: mongoose.Types.ObjectId[];
}

// Interface for GroupChat
interface IGroupChat extends Document {
  name: string;
  messages: mongoose.Types.ObjectId[];
  users: mongoose.Types.ObjectId[];
  createdBy: mongoose.Types.ObjectId;
  deletedMessage: IDeletedMessage[];
  createdAt: Date;
  updatedAt: Date;
}

// DeletedMessage Schema
const DeletedMessageSchema: Schema<IDeletedMessage> = new Schema({
  userID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  deletedMessageofThisUser: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Chat",
    },
  ],
});

// GroupChat Schema
const GroupChatSchema: Schema<IGroupChat> = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    messages: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Chat",
      },
    ],
    users: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    deletedMessage: [DeletedMessageSchema],
  },
  { timestamps: true },
);

const GroupChat: Model<IGroupChat> =
  mongoose.models.groupchats ||
  mongoose.model<IGroupChat>("GroupChat", GroupChatSchema);

export default GroupChat;
