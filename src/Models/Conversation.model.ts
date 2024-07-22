import mongoose, { Document, Schema, Model } from "mongoose";

interface IConversation extends Document {
  participants: mongoose.Schema.Types.ObjectId[]; // Refers to User
  messages: mongoose.Schema.Types.ObjectId[]; // Refers to Message
}

const conversationSchema: Schema<IConversation> = new Schema(
  {
    participants: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
    ],
    messages: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Message",
        default: [],
      },
    ],
  },
  { timestamps: true },
);

// Create a model from the schema
const Conversation: Model<IConversation> = mongoose.model<IConversation>(
  "Conversation",
  conversationSchema,
);

export default Conversation;
