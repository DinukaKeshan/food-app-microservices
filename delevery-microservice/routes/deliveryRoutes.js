'use strict';

const express = require('express');
const router = express.Router();
const deliveryController = require('../controllers/deliveryController');
const {
  validate,
  assignDeliverySchema,
  updateDeliveryStatusSchema,
  updateLocationSchema,
} = require('../middleware/validate');

/**
 * @swagger
 * /api/delivery/assign:
 *   post:
 *     tags: [Deliveries]
 *     summary: Assign a delivery partner to an order
 *     description: Verifies the order via Order Service, checks partner availability, creates delivery record, and notifies Notification Service.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [orderId, partnerId]
 *             properties:
 *               orderId:
 *                 type: string
 *                 example: "order_001"
 *               partnerId:
 *                 type: string
 *                 example: "partner_abc123456789"
 *               distanceToRestaurant:
 *                 type: number
 *                 example: 1.5
 *               distanceToCustomer:
 *                 type: number
 *                 example: 3.2
 *               estimatedTime:
 *                 type: integer
 *                 example: 20
 *               deliveryEarnings:
 *                 type: number
 *                 example: 5.50
 *     responses:
 *       201:
 *         description: Delivery assigned successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/Success'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/Delivery'
 *       404:
 *         description: Partner or Order not found
 *       409:
 *         description: Partner not available or order already assigned
 */
router.post('/assign', validate(assignDeliverySchema), deliveryController.assignDelivery);

/**
 * @swagger
 * /api/delivery/track/{orderId}:
 *   get:
 *     tags: [Deliveries]
 *     summary: Track a delivery by order ID
 *     description: Returns delivery details including real-time location from Redis cache.
 *     parameters:
 *       - in: path
 *         name: orderId
 *         required: true
 *         schema:
 *           type: string
 *         example: order_001
 *     responses:
 *       200:
 *         description: Delivery tracking info
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/Success'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/Delivery'
 *       404:
 *         description: No delivery found for order
 */
router.get('/track/:orderId', deliveryController.trackDelivery);

/**
 * @swagger
 * /api/delivery/{deliveryId}/status:
 *   put:
 *     tags: [Deliveries]
 *     summary: Update delivery status
 *     description: Updates delivery lifecycle status. Triggers notification on PICKED_UP and DELIVERED. Frees partner on DELIVERED.
 *     parameters:
 *       - in: path
 *         name: deliveryId
 *         required: true
 *         schema:
 *           type: string
 *         example: delivery_xyz789012345
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [status]
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [PICKED_UP, IN_TRANSIT, DELIVERED]
 *                 example: IN_TRANSIT
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
 *                       $ref: '#/components/schemas/Delivery'
 *       400:
 *         description: Invalid status transition
 *       404:
 *         description: Delivery not found
 */
router.put('/:deliveryId/status', validate(updateDeliveryStatusSchema), deliveryController.updateStatus);

/**
 * @swagger
 * /api/delivery/{deliveryId}/location:
 *   put:
 *     tags: [Deliveries]
 *     summary: Update real-time delivery location
 *     description: Stores the partner's current GPS coordinates in Redis (TTL=5min) and persists to MongoDB.
 *     parameters:
 *       - in: path
 *         name: deliveryId
 *         required: true
 *         schema:
 *           type: string
 *         example: delivery_xyz789012345
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [latitude, longitude]
 *             properties:
 *               latitude:
 *                 type: number
 *                 minimum: -90
 *                 maximum: 90
 *                 example: 40.7128
 *               longitude:
 *                 type: number
 *                 minimum: -180
 *                 maximum: 180
 *                 example: -74.0060
 *     responses:
 *       200:
 *         description: Location updated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *                   properties:
 *                     latitude: { type: number }
 *                     longitude: { type: number }
 *                     updatedAt: { type: string, format: date-time }
 *       404:
 *         description: Delivery not found
 */
router.put('/:deliveryId/location', validate(updateLocationSchema), deliveryController.updateLocation);

module.exports = router;
