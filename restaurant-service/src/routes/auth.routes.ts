import express from "express";
import { registerOwner, loginOwner } from "../controllers/auth.controller";

const router = express.Router();

router.post("/register", registerOwner);
router.post("/login", loginOwner);

export default router;