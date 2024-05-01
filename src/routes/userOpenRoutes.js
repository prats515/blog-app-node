import { Router } from "express";
import { loginUser } from '../auth/Auth.js';
import { createUser } from "../Controller/UserController.js";

const router =Router();

router.post("/login", loginUser);
router.post("/create",createUser);

export default router;