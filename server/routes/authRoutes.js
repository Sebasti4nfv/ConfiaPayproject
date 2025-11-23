import express from "express";
import { registerUser, loginUser,registerOwner } from "../controllers/authController.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/register-owner", registerOwner); 
export default router;  // 🔹 ESTA LÍNEA ES CLAVE
