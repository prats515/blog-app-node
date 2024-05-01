import { Router } from "express";
import { updateUser, getUserById, getAllUsers, deleteUser } from "../Controller/UserController.js";

const router=Router();

router.put("/:id",updateUser);
router.get("/:id",getUserById);
router.get("/",getAllUsers);
router.delete("/:id",deleteUser);

export default router;