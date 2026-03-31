import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: [true, "User ID is required"],
      ref: "User",
    },
    restaurantId: {
      type: mongoose.Schema.Types.ObjectId,
      required: [true, "Restaurant ID is required"],
    },
    rating: {
      type: Number,
      required: [true, "Rating is required"],
      min: [1, "Rating must be at least 1"],
      max: [5, "Rating cannot exceed 5"],
    },
    title: {
      type: String,
      trim: true,
      maxlength: [100, "Title cannot exceed 100 characters"],
    },
    comment: {
      type: String,
      required: [true, "Comment is required"],
      trim: true,
      minlength: [10, "Comment must be at least 10 characters"],
      maxlength: [1000, "Comment cannot exceed 1000 characters"],
    },
    images: [{ type: String }],
    isVerified: { type: Boolean, default: false },
    helpfulCount: { type: Number, default: 0 },
    tags: [{ type: String, enum: ["food", "service", "ambiance", "value", "delivery"] }],
  },
  { timestamps: true }
);

// Prevent one user from reviewing the same restaurant twice
reviewSchema.index({ userId: 1, restaurantId: 1 }, { unique: true });

const Review = mongoose.model("Review", reviewSchema);
export default Review;
