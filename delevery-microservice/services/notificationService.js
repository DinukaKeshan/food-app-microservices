'use strict';

const { createAxiosClient } = require('../utils/axiosClient');
const logger = require('../utils/logger');

const notificationClient = createAxiosClient(
  process.env.NOTIFICATION_SERVICE_URL || 'http://localhost:3004',
  'NotificationService'
);

/**
 * Send a notification via the Notification Service
 * @param {string} type - Notification type: ASSIGNED | PICKED_UP | DELIVERED
 * @param {object} payload - Delivery and partner details
 */
const sendNotification = async (type, payload) => {
  try {
    const body = {
      type,
      source: 'delivery-service',
      timestamp: new Date().toISOString(),
      data: payload,
    };
    await notificationClient.post('/api/notifications/send', body);
    logger.info(`[NotificationService] Sent ${type} notification for order ${payload.orderId}`);
  } catch (error) {
    // Notification failures must not block the main flow
    logger.error(`[NotificationService] Failed to send ${type} notification: ${error.message}`);
  }
};

const notifyAssigned = (delivery) =>
  sendNotification('DELIVERY_ASSIGNED', {
    orderId: delivery.orderId,
    deliveryId: delivery.deliveryId,
    partnerId: delivery.partnerId,
    partnerName: delivery.partnerName,
    partnerPhone: delivery.partnerPhone,
    estimatedTime: delivery.estimatedTime,
    assignedAt: delivery.assignedAt,
  });

const notifyPickedUp = (delivery) =>
  sendNotification('DELIVERY_PICKED_UP', {
    orderId: delivery.orderId,
    deliveryId: delivery.deliveryId,
    partnerId: delivery.partnerId,
    partnerName: delivery.partnerName,
    pickedUpAt: delivery.pickedUpAt,
    estimatedTime: delivery.estimatedTime,
  });

const notifyDelivered = (delivery) =>
  sendNotification('DELIVERY_COMPLETED', {
    orderId: delivery.orderId,
    deliveryId: delivery.deliveryId,
    partnerId: delivery.partnerId,
    partnerName: delivery.partnerName,
    deliveredAt: delivery.deliveredAt,
    deliveryEarnings: delivery.deliveryEarnings,
  });

module.exports = { notifyAssigned, notifyPickedUp, notifyDelivered };
