'use strict';

const express = require('express');
const router = express.Router();
const partnerController = require('../controllers/partnerController');
const { validate, createPartnerSchema, updatePartnerStatusSchema, historyQuerySchema } = require('../middleware/validate');

/**
 * @swagger
 * /api/delivery/partners:
 *   post:
 *     tags: [Partners]
 *     summary: Register a new delivery partner
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, phone, vehicleType, licenseNumber]
 *             properties:
 *               name:
 *                 type: string
 *                 example: "John Doe"
 *               phone:
 *                 type: string
 *                 example: "+1-555-123-4567"
 *               vehicleType:
 *                 type: string
 *                 enum: [MOTORCYCLE, BIKE, CAR]
 *                 example: MOTORCYCLE
 *               licenseNumber:
 *                 type: string
 *                 example: "DL-1234567890"
 *               deliveryZones:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["downtown", "midtown"]
 *     responses:
 *       201:
 *         description: Partner created successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/Success'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/DeliveryPartner'
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       409:
 *         description: Partner with phone or license already exists
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post('/partners', validate(createPartnerSchema), partnerController.createPartner);

/**
 * @swagger
 * /api/delivery/partner/{partnerId}:
 *   get:
 *     tags: [Partners]
 *     summary: Get delivery partner by ID
 *     parameters:
 *       - in: path
 *         name: partnerId
 *         required: true
 *         schema:
 *           type: string
 *         example: partner_abc123456789
 *     responses:
 *       200:
 *         description: Partner details
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/Success'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/DeliveryPartner'
 *       404:
 *         description: Partner not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/partner/:partnerId', partnerController.getPartner);

/**
 * @swagger
 * /api/delivery/partner/{partnerId}/history:
 *   get:
 *     tags: [Partners]
 *     summary: Get delivery history for a partner (paginated)
 *     parameters:
 *       - in: path
 *         name: partnerId
 *         required: true
 *         schema:
 *           type: string
 *         example: partner_abc123456789
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [PICKED_UP, IN_TRANSIT, DELIVERED]
 *     responses:
 *       200:
 *         description: Paginated delivery history
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Delivery'
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     total: { type: integer }
 *                     page: { type: integer }
 *                     limit: { type: integer }
 *                     totalPages: { type: integer }
 *                     hasNextPage: { type: boolean }
 *                     hasPrevPage: { type: boolean }
 *       404:
 *         description: Partner not found
 */
router.get('/partner/:partnerId/history', validate(historyQuerySchema, 'query'), partnerController.getPartnerHistory);

/**
 * @swagger
 * /api/delivery/partner/{partnerId}/status:
 *   put:
 *     tags: [Partners]
 *     summary: Update partner availability status
 *     parameters:
 *       - in: path
 *         name: partnerId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [currentStatus]
 *             properties:
 *               currentStatus:
 *                 type: string
 *                 enum: [AVAILABLE, BUSY, OFFLINE]
 *                 example: AVAILABLE
 *     responses:
 *       200:
 *         description: Status updated
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/Success'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/DeliveryPartner'
 *       404:
 *         description: Partner not found
 */
router.put('/partner/:partnerId/status', validate(updatePartnerStatusSchema), partnerController.updatePartnerStatus);

/**
 * @swagger
 * /api/delivery/partners/{partnerId}:
 *   delete:
 *     tags: [Partners]
 *     summary: Deactivate (soft-delete) a delivery partner
 *     parameters:
 *       - in: path
 *         name: partnerId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Partner deactivated successfully
 *       404:
 *         description: Partner not found
 */
router.delete('/partners/:partnerId', partnerController.deletePartner);

module.exports = router;
