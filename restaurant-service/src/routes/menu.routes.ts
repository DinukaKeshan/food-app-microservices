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

router.post("/:restaurantId/menu-card", protect, createMenuCardForRestaurant);
router.get("/:restaurantId/menu-card", protect, getMenuCardByRestaurant);

router.post("/:restaurantId/menu-items", protect, createMenuItem);
router.get("/:restaurantId/menu-items", protect, getMenuItemsByRestaurant);
router.get("/:restaurantId/menu-items/:itemId", protect, getMenuItemById);
router.put("/:restaurantId/menu-items/:itemId", protect, updateMenuItem);
router.delete("/:restaurantId/menu-items/:itemId", protect, deleteMenuItem);

export default router;