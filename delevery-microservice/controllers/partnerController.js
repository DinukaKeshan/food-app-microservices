'use strict';

const partnerService = require('../services/partnerService');

/**
 * POST /api/delivery/partners
 */
const createPartner = async (req, res) => {
  const partner = await partnerService.createPartner(req.body);
  res.status(201).json({
    success: true,
    message: 'Delivery partner created successfully',
    data: partner,
  });
};

/**
 * GET /api/delivery/partner/:partnerId
 */
const getPartner = async (req, res) => {
  const partner = await partnerService.getPartnerById(req.params.partnerId);
  res.status(200).json({
    success: true,
    data: partner,
  });
};

/**
 * GET /api/delivery/partner/:partnerId/history
 */
const getPartnerHistory = async (req, res) => {
  const deliveryService = require('../services/deliveryService');
  const { page, limit, status } = req.query;

  const result = await deliveryService.getPartnerHistory(req.params.partnerId, {
    page: parseInt(page) || 1,
    limit: parseInt(limit) || 10,
    status,
  });

  res.status(200).json({
    success: true,
    data: result.deliveries,
    pagination: result.pagination,
  });
};

/**
 * PUT /api/delivery/partner/:partnerId/status
 */
const updatePartnerStatus = async (req, res) => {
  const partner = await partnerService.updatePartnerStatus(
    req.params.partnerId,
    req.body.currentStatus
  );
  res.status(200).json({
    success: true,
    message: `Partner status updated to ${req.body.currentStatus}`,
    data: partner,
  });
};

/**
 * DELETE /api/delivery/partners/:partnerId
 */
const deletePartner = async (req, res) => {
  await partnerService.deletePartner(req.params.partnerId);
  res.status(200).json({
    success: true,
    message: 'Delivery partner deactivated successfully',
  });
};

module.exports = {
  createPartner,
  getPartner,
  getPartnerHistory,
  updatePartnerStatus,
  deletePartner,
};
