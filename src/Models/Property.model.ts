import mongoose, { Document, Schema } from "mongoose";

interface IProperty extends Document {
  shortDescription: string;
  price: string;
  imageUrl: string;
  location: string;
}

const PropertySchema: Schema<IProperty> = new Schema({
  shortDescription: {
    type: String,
    required: true,
  },
  price: {
    type: String,
    required: true,
  },
  imageUrl: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
});

export const Property = mongoose.model<IProperty>("Property", PropertySchema);
