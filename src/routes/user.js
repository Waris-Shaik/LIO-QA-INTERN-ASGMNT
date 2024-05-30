import express from "express";
import { login, logout, myProfile, register } from "../controllers/user.js";
import isAuthenticated from "../middlewares/auth.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);
router.get("/me", isAuthenticated, myProfile);

export default router;
