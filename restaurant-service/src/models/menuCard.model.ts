import mongoose, { Schema, Document, Types } from "mongoose";

export interface IMenuCard extends Document {
  restaurantId: Types.ObjectId;
  title: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

const MenuCardSchema = new Schema<IMenuCard>(
  {
    restaurantId: {
      type: Schema.Types.ObjectId,
      ref: "Restaurant",
      required: true,
      unique: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
      default: "Main Menu",
    },
    description: {
      type: String,
      trim: true,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

const MenuCard = mongoose.model<IMenuCard>("MenuCard", MenuCardSchema);

export default MenuCard;