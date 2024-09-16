// Routes for rest api for posts
import { Router } from "express";
import {
  getPublishedPosts,
  getPostById,
  createPost,
  updatePost,
  deletePost,
} from "../controllers/postsController.js";
import { userRequired } from "../utils/auth.js";
import {
  createComment,
  getCommentsForPost,
} from "../controllers/commentsController.js";

const router = Router();

// Posts
router.get("/", getPublishedPosts);
router.get("/:id", getPostById);
router.post("/", userRequired, createPost);
router.put("/:id", userRequired, updatePost);
router.delete("/:id", userRequired, deletePost);

// Comments
router.get("/:postId/comments/", getCommentsForPost);
router.post("/:postId/comments/", userRequired, createComment);

export default router;
