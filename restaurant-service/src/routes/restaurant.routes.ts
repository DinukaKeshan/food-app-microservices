import express from "express";
import {
  createRestaurant,
  getMyRestaurants,
  getRestaurantById,
  updateRestaurant,
  deleteRestaurant,
} from "../controllers/restaurant.controller";
import { protect } from "../middleware/auth.middleware";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Restaurants
 *   description: Restaurant management endpoints
 */

/**
 * @swagger
 * /api/restaurants:
 *   post:
 *     summary: Create a restaurant
 *     tags: [Restaurants]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - cuisine
 *               - phone
 *               - address
 *               - city
 *               - latitude
 *               - longitude
 *             properties:
 *               name:
 *                 type: string
 *                 example: Spice Garden
 *               description:
 *                 type: string
 *                 example: Authentic Sri Lankan food
 *               cuisine:
 *                 type: string
 *                 example: Sri Lankan
 *               phone:
 *                 type: string
 *                 example: 0771234567
 *               email:
 *                 type: string
 *                 example: spicegarden@example.com
 *               address:
 *                 type: string
 *                 example: 123 Main Street
 *               city:
 *                 type: string
 *                 example: Colombo
 *               latitude:
 *                 type: number
 *                 example: 6.9271
 *               longitude:
 *                 type: number
 *                 example: 79.8612
 *               isOpen:
 *                 type: boolean
 *                 example: true
 *     responses:
 *       201:
 *         description: Restaurant created successfully
 *       401:
 *         description: Unauthorized
 */
router.post("/", protect, createRestaurant);

/**
 * @swagger
 * /api/restaurants:
 *   get:
 *     summary: Get all restaurants for the logged-in owner
 *     tags: [Restaurants]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Restaurants fetched successfully
 *       401:
 *         description: Unauthorized
 */
router.get("/", protect, getMyRestaurants);

/**
 * @swagger
 * /api/restaurants/{id}:
 *   get:
 *     summary: Get a single restaurant by ID
 *     tags: [Restaurants]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         example: 69cad1b6be2832d16761d089
 *     responses:
 *       200:
 *         description: Restaurant fetched successfully
 *       404:
 *         description: Restaurant not found
 */
router.get("/:id", protect, getRestaurantById);

/**
 * @swagger
 * /api/restaurants/{id}:
 *   put:
 *     summary: Update a restaurant
 *     tags: [Restaurants]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Restaurant updated successfully
 *       404:
 *         description: Restaurant not found
 */
router.put("/:id", protect, updateRestaurant);

/**
 * @swagger
 * /api/restaurants/{id}:
 *   delete:
 *     summary: Delete a restaurant
 *     tags: [Restaurants]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Restaurant deleted successfully
 *       404:
 *         description: Restaurant not found
 */
router.delete("/:id", protect, deleteRestaurant);

export default router;