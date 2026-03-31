'use strict';

const DeliveryPartner = require('../models/DeliveryPartner');
const { generatePartnerId } = require('../utils/idGenerator');
const logger = require('../utils/logger');

/**
 * Create a new delivery partner
 */
const createPartner = async (data) => {
  const partnerId = generatePartnerId();
  const partner = new DeliveryPartner({ partnerId, ...data });
  await partner.save();
  logger.info(`[PartnerService] Created partner: ${partnerId}`);
  return partner;
};

/**
 * Get a partner by ID
 */
const getPartnerById = async (partnerId) => {
  const partner = await DeliveryPartner.findOne({ partnerId, isActive: true });
  if (!partner) {
    const err = new Error(`Partner ${partnerId} not found`);
    err.statusCode = 404;
    throw err;
  }
  return partner;
};

/**
 * Update partner status (AVAILABLE / BUSY / OFFLINE)
 */
const updatePartnerStatus = async (partnerId, currentStatus) => {
  const partner = await DeliveryPartner.findOneAndUpdate(
    { partnerId, isActive: true },
    { currentStatus },
    { new: true, runValidators: true }
  );
  if (!partner) {
    const err = new Error(`Partner ${partnerId} not found`);
    err.statusCode = 404;
    throw err;
  }
  logger.info(`[PartnerService] Updated status of ${partnerId} to ${currentStatus}`);
  return partner;
};

/**
 * Soft-delete a partner (set isActive = false)
 */
const deletePartner = async (partnerId) => {
  const partner = await DeliveryPartner.findOneAndUpdate(
    { partnerId, isActive: true },
    { isActive: false, currentStatus: 'OFFLINE' },
    { new: true }
  );
  if (!partner) {
    const err = new Error(`Partner ${partnerId} not found`);
    err.statusCode = 404;
    throw err;
  }
  logger.info(`[PartnerService] Soft-deleted partner: ${partnerId}`);
  return partner;
};

/**
 * Find an available partner (optionally by zone)
 */
const findAvailablePartner = async (zone) => {
  const query = { currentStatus: 'AVAILABLE', isActive: true };
  if (zone) query.deliveryZones = zone;
  return DeliveryPartner.findOne(query).sort({ rating: -1, totalDeliveries: 1 });
};

module.exports = {
  createPartner,
  getPartnerById,
  updatePartnerStatus,
  deletePartner,
  findAvailablePartner,
};
