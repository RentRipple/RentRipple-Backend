import mongoose, { Document, Schema } from "mongoose";

export interface IReview extends Document {
  reviewer_user: mongoose.Schema.Types.ObjectId;
  reviewee_property: mongoose.Schema.Types.ObjectId;
  rating: number;
  review: string;
}

const ReviewSchema: Schema<IReview> = new Schema({
  reviewer_user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  reviewee_property: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Property",
    required: true,
  },
  rating: { type: Number, required: true },
  review: { type: String, required: true },
});

export const Review = mongoose.model<IReview>("Review", ReviewSchema);
