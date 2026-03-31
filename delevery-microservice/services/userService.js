'use strict';

const { createAxiosClient } = require('../utils/axiosClient');
const logger = require('../utils/logger');

const userClient = createAxiosClient(
  process.env.USER_SERVICE_URL || 'http://localhost:3002',
  'UserService'
);

/**
 * Fetch customer delivery address from the User Service
 * @param {string} customerId
 * @returns {object} address data
 */
const getCustomerAddress = async (customerId) => {
  try {
    const response = await userClient.get(`/api/users/${customerId}/address`);
    logger.info(`[UserService] Fetched address for customer: ${customerId}`);
    return response.data;
  } catch (error) {
    if (error.response?.status === 404) {
      const err = new Error(`Customer ${customerId} not found`);
      err.statusCode = 404;
      throw err;
    }
    logger.error(`[UserService] Could not fetch address for ${customerId}: ${error.message}`);
    return null;
  }
};

module.exports = { getCustomerAddress };
