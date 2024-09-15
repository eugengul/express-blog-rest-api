import { Router } from "express";
import { meGet } from "../controllers/usersController.js";
import { userRequired } from "../utils/auth.js";

const usersRouter = Router();

usersRouter.get("/me", userRequired, meGet);

export default usersRouter;
