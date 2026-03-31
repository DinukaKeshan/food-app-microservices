'use strict';

const { v4: uuidv4 } = require('uuid');

/**
 * Generate a unique delivery partner ID
 * Format: partner_<8 char hex>
 */
const generatePartnerId = () => {
  return `partner_${uuidv4().replace(/-/g, '').substring(0, 12)}`;
};

/**
 * Generate a unique delivery ID
 * Format: delivery_<8 char hex>
 */
const generateDeliveryId = () => {
  return `delivery_${uuidv4().replace(/-/g, '').substring(0, 12)}`;
};

module.exports = { generatePartnerId, generateDeliveryId };
