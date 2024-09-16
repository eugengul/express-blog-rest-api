// Routes for rest api for comments
import { Router } from "express";
import { deleteComment } from "../controllers/commentsController.js";
import { userRequired } from "../utils/auth.js";

const router = Router();

router.delete("/:id", userRequired, deleteComment);

export default router;
