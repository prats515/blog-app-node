import { Router } from "express";
import { createComment, getCommentById, fetchAllComments, updateComment, deleteComment } from "../Controller/CommentController.js";

const router=Router();

router.post("/",createComment);
router.get("/:id",getCommentById);
router.get("/",fetchAllComments);
router.delete("/:id",deleteComment);
router.put("/:id",updateComment)

export default router;