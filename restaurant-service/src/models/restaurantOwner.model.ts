import mongoose, { Schema, Document } from "mongoose";

export interface IRestaurantOwner extends Document {
  name: string;
  email: string;
  password: string;
  createdAt: Date;
}

const RestaurantOwnerSchema = new Schema<IRestaurantOwner>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const RestaurantOwner = mongoose.model<IRestaurantOwner>(
  "RestaurantOwner",
  RestaurantOwnerSchema
);

export default RestaurantOwner;