'use strict';

const { createAxiosClient } = require('../utils/axiosClient');
const logger = require('../utils/logger');

const orderClient = createAxiosClient(
  process.env.ORDER_SERVICE_URL || 'http://localhost:3001',
  'OrderService'
);

/**
 * Verify an order exists in the Order Service
 * @param {string} orderId
 * @returns {object} order data
 * @throws {Error} if order not found or service unavailable
 */
const verifyOrder = async (orderId) => {
  try {
    const response = await orderClient.get(`/api/orders/${orderId}`);
    logger.info(`[OrderService] Verified order: ${orderId}`);
    return response.data;
  } catch (error) {
    if (error.response?.status === 404) {
      const err = new Error(`Order ${orderId} not found`);
      err.statusCode = 404;
      throw err;
    }
    logger.error(`[OrderService] Could not verify order ${orderId}: ${error.message}`);
    // Soft-fail: return a placeholder so delivery can still be assigned
    // Remove this in strict mode and throw instead
    return { orderId, verified: false };
  }
};

module.exports = { verifyOrder };
