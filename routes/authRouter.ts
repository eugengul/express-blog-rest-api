import { Router } from "express";
import { loginPost, signUpPost } from "../controllers/authController.js";

const authRouter = Router();

authRouter.post("/sign-up", signUpPost);
authRouter.post("/log-in", loginPost);

export default authRouter;
