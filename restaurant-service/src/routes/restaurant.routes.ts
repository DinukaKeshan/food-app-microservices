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

router.post("/", protect, createRestaurant);
router.get("/", protect, getMyRestaurants);
router.get("/:id", protect, getRestaurantById);
router.put("/:id", protect, updateRestaurant);
router.delete("/:id", protect, deleteRestaurant);

export default router;