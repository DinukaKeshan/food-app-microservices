'use strict';

const mongoose = require('mongoose');

const locationSchema = new mongoose.Schema(
  {
    latitude: {
      type: Number,
      required: true,
      min: -90,
      max: 90,
    },
    longitude: {
      type: Number,
      required: true,
      min: -180,
      max: 180,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: false }
);

const deliverySchema = new mongoose.Schema(
  {
    deliveryId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    orderId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    partnerId: {
      type: String,
      required: true,
      index: true,
    },
    partnerName: {
      type: String,
      required: true,
      trim: true,
    },
    partnerPhone: {
      type: String,
      required: true,
      trim: true,
    },
    status: {
      type: String,
      enum: ['PICKED_UP', 'IN_TRANSIT', 'DELIVERED'],
      default: 'PICKED_UP',
      index: true,
    },
    currentLocation: {
      type: locationSchema,
      default: null,
    },
    assignedAt: {
      type: Date,
      default: Date.now,
    },
    pickedUpAt: {
      type: Date,
      default: null,
    },
    deliveredAt: {
      type: Date,
      default: null,
    },
    distanceToRestaurant: {
      type: Number,
      default: 0,
      min: 0,
    },
    distanceToCustomer: {
      type: Number,
      default: 0,
      min: 0,
    },
    estimatedTime: {
      type: Number,
      default: 0,
      min: 0,
      comment: 'Estimated delivery time in minutes',
    },
    deliveryEarnings: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  {
    timestamps: true,
    versionKey: false,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual: duration in minutes since assignment
deliverySchema.virtual('durationMinutes').get(function () {
  if (this.deliveredAt && this.assignedAt) {
    return Math.round((this.deliveredAt - this.assignedAt) / 60000);
  }
  return null;
});

// Indexes for common query patterns
deliverySchema.index({ partnerId: 1, status: 1 });
deliverySchema.index({ orderId: 1, status: 1 });
deliverySchema.index({ assignedAt: -1 });

const Delivery = mongoose.model('Delivery', deliverySchema);
module.exports = Delivery;
