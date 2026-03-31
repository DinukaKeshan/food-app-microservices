'use strict';

const Joi = require('joi');

const validate = (schema, property = 'body') => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req[property], {
      abortEarly: false,
      stripUnknown: true,
    });

    if (error) {
      const errors = error.details.map((d) => d.message.replace(/"/g, "'"));
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors,
      });
    }

    req[property] = value;
    next();
  };
};

// ─── Partner Schemas ────────────────────────────────────────────────────────

const createPartnerSchema = Joi.object({
  name: Joi.string().min(2).max(100).required(),
  phone: Joi.string()
    .pattern(/^\+?[\d\s\-().]{7,20}$/)
    .required()
    .messages({ 'string.pattern.base': "'phone' must be a valid phone number" }),
  vehicleType: Joi.string().valid('MOTORCYCLE', 'BIKE', 'CAR').required(),
  licenseNumber: Joi.string().min(3).max(50).required(),
  deliveryZones: Joi.array().items(Joi.string()).default([]),
});

const updatePartnerStatusSchema = Joi.object({
  currentStatus: Joi.string().valid('AVAILABLE', 'BUSY', 'OFFLINE').required(),
});

// ─── Delivery Schemas ────────────────────────────────────────────────────────

const assignDeliverySchema = Joi.object({
  orderId: Joi.string().required(),
  partnerId: Joi.string().required(),
  distanceToRestaurant: Joi.number().min(0).default(0),
  distanceToCustomer: Joi.number().min(0).default(0),
  estimatedTime: Joi.number().min(0).default(0),
  deliveryEarnings: Joi.number().min(0).default(0),
});

const updateDeliveryStatusSchema = Joi.object({
  status: Joi.string().valid('PICKED_UP', 'IN_TRANSIT', 'DELIVERED').required(),
});

const updateLocationSchema = Joi.object({
  latitude: Joi.number().min(-90).max(90).required(),
  longitude: Joi.number().min(-180).max(180).required(),
});

// ─── Query Schemas ───────────────────────────────────────────────────────────

const historyQuerySchema = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(10),
  status: Joi.string().valid('PICKED_UP', 'IN_TRANSIT', 'DELIVERED').optional(),
});

module.exports = {
  validate,
  createPartnerSchema,
  updatePartnerStatusSchema,
  assignDeliverySchema,
  updateDeliveryStatusSchema,
  updateLocationSchema,
  historyQuerySchema,
};
