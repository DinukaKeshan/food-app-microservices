import { Response } from "express";
import Restaurant from "../models/restaurant.model";
import { AuthRequest } from "../middleware/auth.middleware";

export const createRestaurant = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const ownerId = req.ownerId;

    if (!ownerId) {
      res.status(401).json({
        message: "Not authorized",
      });
      return;
    }

    const {
      name,
      description,
      cuisine,
      phone,
      email,
      address,
      city,
      latitude,
      longitude,
      isOpen,
    } = req.body;

    if (
      !name ||
      !cuisine ||
      !phone ||
      !address ||
      !city ||
      latitude === undefined ||
      longitude === undefined
    ) {
      res.status(400).json({
        message:
          "Name, cuisine, phone, address, city, latitude, and longitude are required",
      });
      return;
    }

    const restaurant = await Restaurant.create({
      ownerId,
      name,
      description,
      cuisine,
      phone,
      email,
      address,
      city,
      latitude,
      longitude,
      isOpen,
    });

    res.status(201).json({
      message: "Restaurant created successfully",
      restaurant,
    });
  } catch (error) {
    console.error("Create restaurant error:", error);
    res.status(500).json({
      message: "Server error while creating restaurant",
    });
  }
};

export const getMyRestaurants = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const ownerId = req.ownerId;

    if (!ownerId) {
      res.status(401).json({
        message: "Not authorized",
      });
      return;
    }

    const restaurants = await Restaurant.find({ ownerId }).sort({ createdAt: -1 });

    res.status(200).json({
      message: "Restaurants fetched successfully",
      count: restaurants.length,
      restaurants,
    });
  } catch (error) {
    console.error("Get my restaurants error:", error);
    res.status(500).json({
      message: "Server error while fetching restaurants",
    });
  }
};

export const getRestaurantById = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const ownerId = req.ownerId;
    const { id } = req.params;

    if (!ownerId) {
      res.status(401).json({
        message: "Not authorized",
      });
      return;
    }

    const restaurant = await Restaurant.findOne({ _id: id, ownerId });

    if (!restaurant) {
      res.status(404).json({
        message: "Restaurant not found",
      });
      return;
    }

    res.status(200).json({
      message: "Restaurant fetched successfully",
      restaurant,
    });
  } catch (error) {
    console.error("Get restaurant by id error:", error);
    res.status(500).json({
      message: "Server error while fetching restaurant",
    });
  }
};

export const updateRestaurant = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const ownerId = req.ownerId;
    const { id } = req.params;

    if (!ownerId) {
      res.status(401).json({
        message: "Not authorized",
      });
      return;
    }

    const existingRestaurant = await Restaurant.findOne({ _id: id, ownerId });

    if (!existingRestaurant) {
      res.status(404).json({
        message: "Restaurant not found",
      });
      return;
    }

    const {
      name,
      description,
      cuisine,
      phone,
      email,
      address,
      city,
      latitude,
      longitude,
      isOpen,
    } = req.body;

    if (
      !name ||
      !cuisine ||
      !phone ||
      !address ||
      !city ||
      latitude === undefined ||
      longitude === undefined
    ) {
      res.status(400).json({
        message:
          "Name, cuisine, phone, address, city, latitude, and longitude are required",
      });
      return;
    }

    existingRestaurant.name = name;
    existingRestaurant.description = description;
    existingRestaurant.cuisine = cuisine;
    existingRestaurant.phone = phone;
    existingRestaurant.email = email;
    existingRestaurant.address = address;
    existingRestaurant.city = city;
    existingRestaurant.latitude = latitude;
    existingRestaurant.longitude = longitude;
    existingRestaurant.isOpen = isOpen;

    const updatedRestaurant = await existingRestaurant.save();

    res.status(200).json({
      message: "Restaurant updated successfully",
      restaurant: updatedRestaurant,
    });
  } catch (error) {
    console.error("Update restaurant error:", error);
    res.status(500).json({
      message: "Server error while updating restaurant",
    });
  }
};

export const deleteRestaurant = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const ownerId = req.ownerId;
    const { id } = req.params;

    if (!ownerId) {
      res.status(401).json({
        message: "Not authorized",
      });
      return;
    }

    const restaurant = await Restaurant.findOne({ _id: id, ownerId });

    if (!restaurant) {
      res.status(404).json({
        message: "Restaurant not found",
      });
      return;
    }

    await restaurant.deleteOne();

    res.status(200).json({
      message: "Restaurant deleted successfully",
    });
  } catch (error) {
    console.error("Delete restaurant error:", error);
    res.status(500).json({
      message: "Server error while deleting restaurant",
    });
  }
};