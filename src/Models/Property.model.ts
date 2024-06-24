import mongoose, { Document, Schema } from "mongoose";

interface IProperty extends Document {
  address_line1: string;
  address_line2: string;
  city: string;
  state: string;
  country: string;
  postal_code: string;
  description: string;
  leaseLength?: string;
  utilities: {
    electricity: boolean;
    water: boolean;
    gas: boolean;
    internet: boolean;
    cable: boolean;
    heat: boolean;
    airConditioning: boolean;
  };
  features: {
    parking: boolean;
    laundry: boolean;
    dishwasher: boolean;
    refrigerator: boolean;
    stove: boolean;
    microwave: boolean;
    garbageDisposal: boolean;
    fireplace: boolean;
    balcony: boolean;
    pool: boolean;
    hotTub: boolean;
    gym: boolean;
    elevator: boolean;
    wheelchairAccessible: boolean;
    furnished: boolean;
    petFriendly: boolean;
  };
  deposit?: string;
  price: string;
  imageUrl: string[];
  location: string;
  ownerDetails: mongoose.Schema.Types.ObjectId;
  extraFeatures?: string;
}

const PropertySchema: Schema<IProperty> = new Schema({
  address_line1: {
    type: String,
    required: true,
  },
  address_line2: {
    type: String,
    required: false,
  },
  city: {
    type: String,
    required: true,
  },
  state: {
    type: String,
    required: true,
  },
  country: {
    type: String,
    required: true,
  },
  postal_code: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  price: {
    type: String,
    required: true,
  },
  leaseLength: {
    type: String,
    required: false,
  },
  deposit: {
    type: String,
    required: false,
  },
  imageUrl: {
    type: [String],
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  utilities: {
    electricity: { type: Boolean, required: true, default: false },
    water: { type: Boolean, required: true, default: false },
    gas: { type: Boolean, required: true, default: false },
    internet: { type: Boolean, required: true, default: false },
    cable: { type: Boolean, required: true, default: false },
    heat: { type: Boolean, required: true, default: false },
    airConditioning: { type: Boolean, required: true, default: false },
  },
  features: {
    parking: { type: Boolean, required: true, default: false },
    laundry: { type: Boolean, required: true, default: false },
    dishwasher: { type: Boolean, required: true, default: false },
    refrigerator: { type: Boolean, required: true, default: false },
    stove: { type: Boolean, required: true, default: false },
    microwave: { type: Boolean, required: true, default: false },
    garbageDisposal: { type: Boolean, required: true, default: false },
    fireplace: { type: Boolean, required: true, default: false },
    balcony: { type: Boolean, required: true, default: false },
    pool: { type: Boolean, required: true, default: false },
    hotTub: { type: Boolean, required: true, default: false },
    gym: { type: Boolean, required: true, default: false },
    elevator: { type: Boolean, required: true, default: false },
    furnished: { type: Boolean, required: true, default: false },
    wheelchairAccessible: { type: Boolean, required: true, default: false },
    petFriendly: { type: Boolean, required: true, default: false },
  },
  ownerDetails: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  extraFeatures: {
    type: String,
    required: false,
  },
});

export const Property = mongoose.model<IProperty>("Property", PropertySchema);
