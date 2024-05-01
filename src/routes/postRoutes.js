import { Router } from "express";
import { createPost, getPosts, getPostById, fetchAllPosts, deletePost } from "../Controller/PostController.js";

const router=Router();

router.post("/",createPost);
router.get("/",getPosts);
router.get("/:id",getPostById);
router.get("/",fetchAllPosts);
router.delete("/:id",deletePost);

export default router;