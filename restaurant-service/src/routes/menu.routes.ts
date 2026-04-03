import express from "express";
import { protect } from "../middleware/auth.middleware";
import {
  createMenuCardForRestaurant,
  getMenuCardByRestaurant,
  createMenuItem,
  getMenuItemsByRestaurant,
  getMenuItemById,
  updateMenuItem,
  deleteMenuItem,
} from "../controllers/menu.controller";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Menu
 *   description: Menu card and menu item endpoints
 */

/**
 * @swagger
 * /api/restaurants/{restaurantId}/menu-card:
 *   post:
 *     summary: Create a menu card for a restaurant
 *     tags: [Menu]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: restaurantId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       201:
 *         description: Menu card created successfully
 */
router.post("/:restaurantId/menu-card", protect, createMenuCardForRestaurant);

/**
 * @swagger
 * /api/restaurants/{restaurantId}/menu-card:
 *   get:
 *     summary: Get menu card and items for a restaurant
 *     tags: [Menu]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: restaurantId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Menu card fetched successfully
 */
router.get("/:restaurantId/menu-card", protect, getMenuCardByRestaurant);

/**
 * @swagger
 * /api/restaurants/{restaurantId}/menu-items:
 *   post:
 *     summary: Create a menu item
 *     tags: [Menu]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: restaurantId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       201:
 *         description: Menu item created successfully
 */
router.post("/:restaurantId/menu-items", protect, createMenuItem);

/**
 * @swagger
 * /api/restaurants/{restaurantId}/menu-items:
 *   get:
 *     summary: Get all menu items for a restaurant
 *     tags: [Menu]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: restaurantId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Menu items fetched successfully
 */
router.get("/:restaurantId/menu-items", protect, getMenuItemsByRestaurant);

/**
 * @swagger
 * /api/restaurants/{restaurantId}/menu-items/{itemId}:
 *   get:
 *     summary: Get a single menu item
 *     tags: [Menu]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: restaurantId
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: itemId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Menu item fetched successfully
 */
router.get("/:restaurantId/menu-items/:itemId", protect, getMenuItemById);

/**
 * @swagger
 * /api/restaurants/{restaurantId}/menu-items/{itemId}:
 *   put:
 *     summary: Update a menu item
 *     tags: [Menu]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: restaurantId
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: itemId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Menu item updated successfully
 */
router.put("/:restaurantId/menu-items/:itemId", protect, updateMenuItem);

/**
 * @swagger
 * /api/restaurants/{restaurantId}/menu-items/{itemId}:
 *   delete:
 *     summary: Delete a menu item
 *     tags: [Menu]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: restaurantId
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: itemId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Menu item deleted successfully
 */
router.delete("/:restaurantId/menu-items/:itemId", protect, deleteMenuItem);

export default router;