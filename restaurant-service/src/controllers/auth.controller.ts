import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import RestaurantOwner from "../models/restaurantOwner.model";

const generateToken = (ownerId: string): string => {
  const jwtSecret = process.env.JWT_SECRET;

  if (!jwtSecret) {
    throw new Error("JWT_SECRET is not defined in .env");
  }

  return jwt.sign({ id: ownerId }, jwtSecret, {
    expiresIn: "7d",
  });
};

export const registerOwner = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      res.status(400).json({
        message: "Name, email, and password are required",
      });
      return;
    }

    const existingOwner = await RestaurantOwner.findOne({ email });

    if (existingOwner) {
      res.status(400).json({
        message: "Owner already exists with this email",
      });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const owner = await RestaurantOwner.create({
      name,
      email,
      password: hashedPassword,
    });

    const token = generateToken(owner._id.toString());

    res.status(201).json({
      message: "Owner registered successfully",
      token,
      owner: {
        id: owner._id,
        name: owner.name,
        email: owner.email,
      },
    });
  } catch (error) {
    console.error("Register owner error:", error);
    res.status(500).json({
      message: "Server error during registration",
    });
  }
};

export const loginOwner = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({
        message: "Email and password are required",
      });
      return;
    }

    const owner = await RestaurantOwner.findOne({ email });

    if (!owner) {
      res.status(401).json({
        message: "Invalid credentials",
      });
      return;
    }

    const isPasswordMatch = await bcrypt.compare(password, owner.password);

    if (!isPasswordMatch) {
      res.status(401).json({
        message: "Invalid credentials",
      });
      return;
    }

    const token = generateToken(owner._id.toString());

    res.status(200).json({
      message: "Login successful",
      token,
      owner: {
        id: owner._id,
        name: owner.name,
        email: owner.email,
      },
    });
  } catch (error) {
    console.error("Login owner error:", error);
    res.status(500).json({
      message: "Server error during login",
    });
  }
};