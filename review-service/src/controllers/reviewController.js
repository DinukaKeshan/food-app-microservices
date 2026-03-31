import Review from "../models/Review.js";

// POST /api/reviews
export const createReview = async (req, res) => {
  try {
    const { restaurantId, rating, title, comment, images, tags } = req.body;

    if (!restaurantId || !rating || !comment) {
      return res.status(400).json({
        success: false,
        message: "restaurantId, rating, and comment are required.",
      });
    }

    const existing = await Review.findOne({
      userId: req.userId,
      restaurantId,
    });
    if (existing) {
      return res.status(400).json({
        success: false,
        message: "You have already reviewed this restaurant.",
      });
    }

    const review = await Review.create({
      userId: req.userId,
      restaurantId,
      rating,
      title,
      comment,
      images,
      tags,
    });

    res.status(201).json({
      success: true,
      message: "Review created successfully.",
      data: { review },
    });
  } catch (error) {
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((e) => e.message);
      return res.status(400).json({ success: false, message: messages.join(", ") });
    }
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "You have already reviewed this restaurant.",
      });
    }
    res.status(500).json({ success: false, message: "Server error creating review." });
  }
};

// GET /api/reviews
export const getAllReviews = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const filter = {};
    if (req.query.minRating) filter.rating = { $gte: parseInt(req.query.minRating) };
    if (req.query.isVerified !== undefined) filter.isVerified = req.query.isVerified === "true";

    const [reviews, total] = await Promise.all([
      Review.find(filter)
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 }),
      Review.countDocuments(filter),
    ]);

    res.status(200).json({
      success: true,
      data: {
        reviews,
        pagination: { page, limit, total, pages: Math.ceil(total / limit) },
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error fetching reviews." });
  }
};

// GET /api/reviews/:id
export const getReviewById = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) {
      return res.status(404).json({ success: false, message: "Review not found." });
    }
    res.status(200).json({ success: true, data: { review } });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error fetching review." });
  }
};

// GET /api/reviews/restaurant/:restaurantId
export const getReviewsByRestaurant = async (req, res) => {
  try {
    const { restaurantId } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const [reviews, total] = await Promise.all([
      Review.find({ restaurantId })
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 }),
      Review.countDocuments({ restaurantId }),
    ]);

    // Calculate average rating
    const ratingAgg = await Review.aggregate([
      { $match: { restaurantId: new (await import("mongoose")).default.Types.ObjectId(restaurantId) } },
      { $group: { _id: null, avgRating: { $avg: "$rating" }, count: { $sum: 1 } } },
    ]);

    const averageRating =
      ratingAgg.length > 0 ? Math.round(ratingAgg[0].avgRating * 10) / 10 : 0;

    res.status(200).json({
      success: true,
      data: {
        reviews,
        averageRating,
        pagination: { page, limit, total, pages: Math.ceil(total / limit) },
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error fetching restaurant reviews." });
  }
};

// PUT /api/reviews/:id
export const updateReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) {
      return res.status(404).json({ success: false, message: "Review not found." });
    }

    // Only owner or admin can update
    if (review.userId.toString() !== req.userId && req.userRole !== "admin") {
      return res.status(403).json({
        success: false,
        message: "You can only update your own reviews.",
      });
    }

    const { rating, title, comment, images, tags } = req.body;
    const allowedUpdates = {};
    if (rating !== undefined) allowedUpdates.rating = rating;
    if (title !== undefined) allowedUpdates.title = title;
    if (comment !== undefined) allowedUpdates.comment = comment;
    if (images !== undefined) allowedUpdates.images = images;
    if (tags !== undefined) allowedUpdates.tags = tags;

    const updated = await Review.findByIdAndUpdate(req.params.id, allowedUpdates, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      message: "Review updated successfully.",
      data: { review: updated },
    });
  } catch (error) {
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((e) => e.message);
      return res.status(400).json({ success: false, message: messages.join(", ") });
    }
    res.status(500).json({ success: false, message: "Server error updating review." });
  }
};

// DELETE /api/reviews/:id
export const deleteReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) {
      return res.status(404).json({ success: false, message: "Review not found." });
    }

    // Only owner or admin can delete
    if (review.userId.toString() !== req.userId && req.userRole !== "admin") {
      return res.status(403).json({
        success: false,
        message: "You can only delete your own reviews.",
      });
    }

    await review.deleteOne();
    res.status(200).json({ success: true, message: "Review deleted successfully." });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error deleting review." });
  }
};

// PATCH /api/reviews/:id/helpful
export const markHelpful = async (req, res) => {
  try {
    const review = await Review.findByIdAndUpdate(
      req.params.id,
      { $inc: { helpfulCount: 1 } },
      { new: true }
    );
    if (!review) {
      return res.status(404).json({ success: false, message: "Review not found." });
    }
    res.status(200).json({
      success: true,
      message: "Marked as helpful.",
      data: { helpfulCount: review.helpfulCount },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error." });
  }
};
