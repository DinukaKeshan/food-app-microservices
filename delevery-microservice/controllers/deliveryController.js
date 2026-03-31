'use strict';

const deliveryService = require('../services/deliveryService');
const orderService = require('../services/orderService');

/**
 * POST /api/delivery/assign
 */
const assignDelivery = async (req, res) => {
  // Verify order exists in Order Service
  await orderService.verifyOrder(req.body.orderId);

  const delivery = await deliveryService.assignDelivery(req.body);
  res.status(201).json({
    success: true,
    message: 'Delivery assigned successfully',
    data: delivery,
  });
};

/**
 * GET /api/delivery/track/:orderId
 */
const trackDelivery = async (req, res) => {
  const delivery = await deliveryService.trackDelivery(req.params.orderId);
  res.status(200).json({
    success: true,
    data: delivery,
  });
};

/**
 * PUT /api/delivery/:deliveryId/status
 */
const updateStatus = async (req, res) => {
  const delivery = await deliveryService.updateDeliveryStatus(
    req.params.deliveryId,
    req.body.status
  );
  res.status(200).json({
    success: true,
    message: `Delivery status updated to ${req.body.status}`,
    data: delivery,
  });
};

/**
 * PUT /api/delivery/:deliveryId/location
 */
const updateLocation = async (req, res) => {
  const { latitude, longitude } = req.body;
  const location = await deliveryService.updateDeliveryLocation(
    req.params.deliveryId,
    latitude,
    longitude
  );
  res.status(200).json({
    success: true,
    message: 'Location updated successfully',
    data: location,
  });
};

module.exports = { assignDelivery, trackDelivery, updateStatus, updateLocation };
