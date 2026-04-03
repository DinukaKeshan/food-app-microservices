import express from "express";
import { registerOwner, loginOwner } from "../controllers/auth.controller";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Restaurant owner authentication
 */

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Register a restaurant owner
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *             properties:
 *               name:
 *                 type: string
 *                 example: Test Owner
 *               email:
 *                 type: string
 *                 example: owner1@example.com
 *               password:
 *                 type: string
 *                 example: 123456
 *     responses:
 *       201:
 *         description: Owner registered successfully
 *       400:
 *         description: Invalid input or owner already exists
 */
router.post("/register", registerOwner);

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Login a restaurant owner
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 example: owner1@example.com
 *               password:
 *                 type: string
 *                 example: 123456
 *     responses:
 *       200:
 *         description: Login successful
 *       401:
 *         description: Invalid credentials
 */
router.post("/login", loginOwner);

export default router;