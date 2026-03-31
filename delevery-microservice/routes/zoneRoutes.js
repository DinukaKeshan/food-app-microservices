'use strict';

const express = require('express');
const router = express.Router();
const zoneController = require('../controllers/zoneController');

/**
 * @swagger
 * /api/delivery/zones:
 *   get:
 *     tags: [Zones]
 *     summary: Get all active delivery zones
 *     description: Returns all configured delivery zones with coverage radius and fare information.
 *     responses:
 *       200:
 *         description: List of delivery zones
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 count:
 *                   type: integer
 *                   example: 5
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       zoneId:
 *                         type: string
 *                         example: zone_downtown
 *                       name:
 *                         type: string
 *                         example: Downtown
 *                       description:
 *                         type: string
 *                       active:
 *                         type: boolean
 *                       coverageRadiusKm:
 *                         type: number
 *                         example: 5
 *                       baseFare:
 *                         type: number
 *                         example: 2.5
 *                       perKmRate:
 *                         type: number
 *                         example: 1.2
 */
router.get('/zones', zoneController.getZones);

module.exports = router;
