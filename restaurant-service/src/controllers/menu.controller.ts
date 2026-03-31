import { Response } from "express";
import mongoose from "mongoose";
import { AuthRequest } from "../middleware/auth.middleware";
import Restaurant from "../models/restaurant.model";
import MenuCard from "../models/menuCard.model";
import MenuItem from "../models/menuItem.model";

export const createMenuCardForRestaurant = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const ownerId = req.ownerId;
    const restaurantIdParam = req.params.restaurantId;
    const { title, description } = req.body;

    if (!ownerId) {
      res.status(401).json({ message: "Not authorized" });
      return;
    }

    if (!restaurantIdParam || Array.isArray(restaurantIdParam)) {
      res.status(400).json({ message: "Invalid restaurant id" });
      return;
    }

    if (!mongoose.Types.ObjectId.isValid(restaurantIdParam)) {
      res.status(400).json({ message: "Invalid restaurant id format" });
      return;
    }

    const restaurantId = new mongoose.Types.ObjectId(restaurantIdParam);

    const restaurant = await Restaurant.findOne({
      _id: restaurantId,
      ownerId,
    });

    if (!restaurant) {
      res.status(404).json({ message: "Restaurant not found" });
      return;
    }

    const existingMenuCard = await MenuCard.findOne({ restaurantId });

    if (existingMenuCard) {
      res.status(400).json({
        message: "This restaurant already has a menu card",
      });
      return;
    }

    const menuCard = await MenuCard.create({
      restaurantId,
      title: title || "Main Menu",
      description: description || "",
    });

    res.status(201).json({
      message: "Menu card created successfully",
      menuCard,
    });
  } catch (error) {
    console.error("Create menu card error:", error);
    res.status(500).json({ message: "Server error while creating menu card" });
  }
};

export const getMenuCardByRestaurant = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const ownerId = req.ownerId;
    const restaurantIdParam = req.params.restaurantId;

    if (!ownerId) {
      res.status(401).json({ message: "Not authorized" });
      return;
    }

    if (!restaurantIdParam || Array.isArray(restaurantIdParam)) {
      res.status(400).json({ message: "Invalid restaurant id" });
      return;
    }

    if (!mongoose.Types.ObjectId.isValid(restaurantIdParam)) {
      res.status(400).json({ message: "Invalid restaurant id format" });
      return;
    }

    const restaurantId = new mongoose.Types.ObjectId(restaurantIdParam);

    const restaurant = await Restaurant.findOne({
      _id: restaurantId,
      ownerId,
    });

    if (!restaurant) {
      res.status(404).json({ message: "Restaurant not found" });
      return;
    }

    const menuCard = await MenuCard.findOne({ restaurantId });

    if (!menuCard) {
      res.status(404).json({ message: "Menu card not found" });
      return;
    }

    const menuItems = await MenuItem.find({ restaurantId }).sort({
      category: 1,
      createdAt: -1,
    });

    res.status(200).json({
      message: "Menu card fetched successfully",
      menuCard,
      menuItems,
    });
  } catch (error) {
    console.error("Get menu card error:", error);
    res.status(500).json({ message: "Server error while fetching menu card" });
  }
};

export const createMenuItem = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const ownerId = req.ownerId;
    const restaurantIdParam = req.params.restaurantId;
    const { name, description, category, price, isAvailable } = req.body;

    if (!ownerId) {
      res.status(401).json({ message: "Not authorized" });
      return;
    }

    if (!restaurantIdParam || Array.isArray(restaurantIdParam)) {
      res.status(400).json({ message: "Invalid restaurant id" });
      return;
    }

    if (!mongoose.Types.ObjectId.isValid(restaurantIdParam)) {
      res.status(400).json({ message: "Invalid restaurant id format" });
      return;
    }

    const restaurantId = new mongoose.Types.ObjectId(restaurantIdParam);

    const restaurant = await Restaurant.findOne({
      _id: restaurantId,
      ownerId,
    });

    if (!restaurant) {
      res.status(404).json({ message: "Restaurant not found" });
      return;
    }

    const menuCard = await MenuCard.findOne({ restaurantId });

    if (!menuCard) {
      res.status(400).json({
        message: "Create a menu card first for this restaurant",
      });
      return;
    }

    if (!name || !category || price === undefined) {
      res.status(400).json({
        message: "Name, category, and price are required",
      });
      return;
    }

    const menuItem = await MenuItem.create({
      menuCardId: menuCard._id,
      restaurantId,
      name,
      description,
      category,
      price,
      isAvailable,
    });

    res.status(201).json({
      message: "Menu item created successfully",
      menuItem,
    });
  } catch (error) {
    console.error("Create menu item error:", error);
    res.status(500).json({ message: "Server error while creating menu item" });
  }
};

export const getMenuItemsByRestaurant = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const ownerId = req.ownerId;
    const restaurantIdParam = req.params.restaurantId;

    if (!ownerId) {
      res.status(401).json({ message: "Not authorized" });
      return;
    }

    if (!restaurantIdParam || Array.isArray(restaurantIdParam)) {
      res.status(400).json({ message: "Invalid restaurant id" });
      return;
    }

    if (!mongoose.Types.ObjectId.isValid(restaurantIdParam)) {
      res.status(400).json({ message: "Invalid restaurant id format" });
      return;
    }

    const restaurantId = new mongoose.Types.ObjectId(restaurantIdParam);

    const restaurant = await Restaurant.findOne({
      _id: restaurantId,
      ownerId,
    });

    if (!restaurant) {
      res.status(404).json({ message: "Restaurant not found" });
      return;
    }

    const menuItems = await MenuItem.find({ restaurantId }).sort({
      category: 1,
      createdAt: -1,
    });

    res.status(200).json({
      message: "Menu items fetched successfully",
      count: menuItems.length,
      menuItems,
    });
  } catch (error) {
    console.error("Get menu items error:", error);
    res.status(500).json({ message: "Server error while fetching menu items" });
  }
};

export const getMenuItemById = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const ownerId = req.ownerId;
    const restaurantIdParam = req.params.restaurantId;
    const itemIdParam = req.params.itemId;

    if (!ownerId) {
      res.status(401).json({ message: "Not authorized" });
      return;
    }

    if (!restaurantIdParam || Array.isArray(restaurantIdParam)) {
      res.status(400).json({ message: "Invalid restaurant id" });
      return;
    }

    if (!itemIdParam || Array.isArray(itemIdParam)) {
      res.status(400).json({ message: "Invalid menu item id" });
      return;
    }

    if (!mongoose.Types.ObjectId.isValid(restaurantIdParam)) {
      res.status(400).json({ message: "Invalid restaurant id format" });
      return;
    }

    if (!mongoose.Types.ObjectId.isValid(itemIdParam)) {
      res.status(400).json({ message: "Invalid menu item id format" });
      return;
    }

    const restaurantId = new mongoose.Types.ObjectId(restaurantIdParam);
    const itemId = new mongoose.Types.ObjectId(itemIdParam);

    const restaurant = await Restaurant.findOne({
      _id: restaurantId,
      ownerId,
    });

    if (!restaurant) {
      res.status(404).json({ message: "Restaurant not found" });
      return;
    }

    const menuItem = await MenuItem.findOne({
      _id: itemId,
      restaurantId,
    });

    if (!menuItem) {
      res.status(404).json({ message: "Menu item not found" });
      return;
    }

    res.status(200).json({
      message: "Menu item fetched successfully",
      menuItem,
    });
  } catch (error) {
    console.error("Get menu item by id error:", error);
    res.status(500).json({ message: "Server error while fetching menu item" });
  }
};

export const updateMenuItem = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const ownerId = req.ownerId;
    const restaurantIdParam = req.params.restaurantId;
    const itemIdParam = req.params.itemId;
    const { name, description, category, price, isAvailable } = req.body;

    if (!ownerId) {
      res.status(401).json({ message: "Not authorized" });
      return;
    }

    if (!restaurantIdParam || Array.isArray(restaurantIdParam)) {
      res.status(400).json({ message: "Invalid restaurant id" });
      return;
    }

    if (!itemIdParam || Array.isArray(itemIdParam)) {
      res.status(400).json({ message: "Invalid menu item id" });
      return;
    }

    if (!mongoose.Types.ObjectId.isValid(restaurantIdParam)) {
      res.status(400).json({ message: "Invalid restaurant id format" });
      return;
    }

    if (!mongoose.Types.ObjectId.isValid(itemIdParam)) {
      res.status(400).json({ message: "Invalid menu item id format" });
      return;
    }

    const restaurantId = new mongoose.Types.ObjectId(restaurantIdParam);
    const itemId = new mongoose.Types.ObjectId(itemIdParam);

    const restaurant = await Restaurant.findOne({
      _id: restaurantId,
      ownerId,
    });

    if (!restaurant) {
      res.status(404).json({ message: "Restaurant not found" });
      return;
    }

    const menuItem = await MenuItem.findOne({
      _id: itemId,
      restaurantId,
    });

    if (!menuItem) {
      res.status(404).json({ message: "Menu item not found" });
      return;
    }

    if (!name || !category || price === undefined) {
      res.status(400).json({
        message: "Name, category, and price are required",
      });
      return;
    }

    menuItem.name = name;
    menuItem.description = description;
    menuItem.category = category;
    menuItem.price = price;
    menuItem.isAvailable = isAvailable;

    const updatedMenuItem = await menuItem.save();

    res.status(200).json({
      message: "Menu item updated successfully",
      menuItem: updatedMenuItem,
    });
  } catch (error) {
    console.error("Update menu item error:", error);
    res.status(500).json({ message: "Server error while updating menu item" });
  }
};

export const deleteMenuItem = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const ownerId = req.ownerId;
    const restaurantIdParam = req.params.restaurantId;
    const itemIdParam = req.params.itemId;

    if (!ownerId) {
      res.status(401).json({ message: "Not authorized" });
      return;
    }

    if (!restaurantIdParam || Array.isArray(restaurantIdParam)) {
      res.status(400).json({ message: "Invalid restaurant id" });
      return;
    }

    if (!itemIdParam || Array.isArray(itemIdParam)) {
      res.status(400).json({ message: "Invalid menu item id" });
      return;
    }

    if (!mongoose.Types.ObjectId.isValid(restaurantIdParam)) {
      res.status(400).json({ message: "Invalid restaurant id format" });
      return;
    }

    if (!mongoose.Types.ObjectId.isValid(itemIdParam)) {
      res.status(400).json({ message: "Invalid menu item id format" });
      return;
    }

    const restaurantId = new mongoose.Types.ObjectId(restaurantIdParam);
    const itemId = new mongoose.Types.ObjectId(itemIdParam);

    const restaurant = await Restaurant.findOne({
      _id: restaurantId,
      ownerId,
    });

    if (!restaurant) {
      res.status(404).json({ message: "Restaurant not found" });
      return;
    }

    const menuItem = await MenuItem.findOne({
      _id: itemId,
      restaurantId,
    });

    if (!menuItem) {
      res.status(404).json({ message: "Menu item not found" });
      return;
    }

    await menuItem.deleteOne();

    res.status(200).json({
      message: "Menu item deleted successfully",
    });
  } catch (error) {
    console.error("Delete menu item error:", error);
    res.status(500).json({ message: "Server error while deleting menu item" });
  }
};