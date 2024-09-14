import { Router } from "express";
import { meGet } from "../controllers/usersController.js";
import { validateAccessToken } from "../utils/auth.js";

const usersRouter = Router();

usersRouter.get("/me", validateAccessToken, meGet);

export default usersRouter;
