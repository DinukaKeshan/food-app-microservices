'use strict';

const Delivery = require('../models/Delivery');
const DeliveryPartner = require('../models/DeliveryPartner');
const locationService = require('./locationService');
const notificationService = require('./notificationService');
const { generateDeliveryId } = require('../utils/idGenerator');
const logger = require('../utils/logger');

/**
 * Assign a delivery to a partner
 */
const assignDelivery = async ({ orderId, partnerId, distanceToRestaurant, distanceToCustomer, estimatedTime, deliveryEarnings }) => {
  // Verify partner availability
  const partner = await DeliveryPartner.findOne({ partnerId, isActive: true });
  if (!partner) {
    const err = new Error(`Partner ${partnerId} not found`);
    err.statusCode = 404;
    throw err;
  }
  if (partner.currentStatus !== 'AVAILABLE') {
    const err = new Error(`Partner ${partnerId} is not available (current status: ${partner.currentStatus})`);
    err.statusCode = 409;
    throw err;
  }

  // Check for duplicate order assignment
  const existing = await Delivery.findOne({ orderId });
  if (existing) {
    const err = new Error(`Order ${orderId} already has an assigned delivery`);
    err.statusCode = 409;
    throw err;
  }

  const deliveryId = generateDeliveryId();

  // Create delivery record
  const delivery = new Delivery({
    deliveryId,
    orderId,
    partnerId,
    partnerName: partner.name,
    partnerPhone: partner.phone,
    status: 'PICKED_UP',
    assignedAt: new Date(),
    distanceToRestaurant,
    distanceToCustomer,
    estimatedTime,
    deliveryEarnings,
  });

  await delivery.save();

  // Mark partner as BUSY
  partner.currentStatus = 'BUSY';
  await partner.save();

  // Fire-and-forget notification
  notificationService.notifyAssigned(delivery).catch(() => {});

  logger.info(`[DeliveryService] Assigned delivery ${deliveryId} to partner ${partnerId} for order ${orderId}`);
  return delivery;
};

/**
 * Track delivery by orderId — reads latest location from Redis first
 */
const trackDelivery = async (orderId) => {
  const delivery = await Delivery.findOne({ orderId });
  if (!delivery) {
    const err = new Error(`No delivery found for order ${orderId}`);
    err.statusCode = 404;
    throw err;
  }

  // Try to get fresh location from Redis cache
  const cachedLocation = await locationService.getLocation(delivery.deliveryId);
  if (cachedLocation) {
    delivery.currentLocation = cachedLocation;
  }

  return delivery;
};

/**
 * Update delivery status
 */
const updateDeliveryStatus = async (deliveryId, status) => {
  const delivery = await Delivery.findOne({ deliveryId });
  if (!delivery) {
    const err = new Error(`Delivery ${deliveryId} not found`);
    err.statusCode = 404;
    throw err;
  }

  // Guard against backward status transitions
  const statusOrder = ['PICKED_UP', 'IN_TRANSIT', 'DELIVERED'];
  const currentIdx = statusOrder.indexOf(delivery.status);
  const newIdx = statusOrder.indexOf(status);
  if (newIdx < currentIdx) {
    const err = new Error(`Cannot transition from ${delivery.status} back to ${status}`);
    err.statusCode = 400;
    throw err;
  }

  delivery.status = status;

  if (status === 'PICKED_UP') {
    delivery.pickedUpAt = new Date();
    notificationService.notifyPickedUp(delivery).catch(() => {});
  } else if (status === 'IN_TRANSIT') {
    if (!delivery.pickedUpAt) delivery.pickedUpAt = new Date();
  } else if (status === 'DELIVERED') {
    delivery.deliveredAt = new Date();
    notificationService.notifyDelivered(delivery).catch(() => {});

    // Free partner and increment delivery count
    await DeliveryPartner.findOneAndUpdate(
      { partnerId: delivery.partnerId },
      { currentStatus: 'AVAILABLE', $inc: { totalDeliveries: 1 } }
    );

    // Clean up Redis location cache
    await locationService.deleteLocation(deliveryId);
  }

  await delivery.save();
  logger.info(`[DeliveryService] Updated delivery ${deliveryId} status to ${status}`);
  return delivery;
};

/**
 * Update real-time delivery location (Redis + MongoDB)
 */
const updateDeliveryLocation = async (deliveryId, latitude, longitude) => {
  const delivery = await Delivery.findOne({ deliveryId });
  if (!delivery) {
    const err = new Error(`Delivery ${deliveryId} not found`);
    err.statusCode = 404;
    throw err;
  }

  const updatedAt = new Date();

  // Write to Redis (primary, fast-access)
  await locationService.setLocation(deliveryId, latitude, longitude);

  // Write to MongoDB (persistent record)
  delivery.currentLocation = { latitude, longitude, updatedAt };
  await delivery.save();

  logger.debug(`[DeliveryService] Updated location for delivery ${deliveryId}: (${latitude}, ${longitude})`);
  return delivery.currentLocation;
};

/**
 * Get delivery history for a partner with pagination and status filter
 */
const getPartnerHistory = async (partnerId, { page = 1, limit = 10, status }) => {
  const query = { partnerId };
  if (status) query.status = status;

  const skip = (page - 1) * limit;

  const [deliveries, total] = await Promise.all([
    Delivery.find(query).sort({ assignedAt: -1 }).skip(skip).limit(limit),
    Delivery.countDocuments(query),
  ]);

  return {
    deliveries,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      hasNextPage: page < Math.ceil(total / limit),
      hasPrevPage: page > 1,
    },
  };
};

module.exports = {
  assignDelivery,
  trackDelivery,
  updateDeliveryStatus,
  updateDeliveryLocation,
  getPartnerHistory,
};
