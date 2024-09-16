import { Router } from "express";
import { meGet } from "../controllers/usersController.js";
import { userRequired } from "../utils/auth.js";
import { postsByUser } from "../controllers/postsController.js";

const usersRouter = Router();

usersRouter.get("/me", userRequired, meGet);

// Posts
usersRouter.get("/me/posts", userRequired, postsByUser);

export default usersRouter;
