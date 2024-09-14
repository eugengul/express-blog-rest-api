import asyncHandler from "../utils/asyncHanlder.js";
import { assertHasUser } from "../utils/auth.js";
import { Request, Response } from "express";

// Returns information about the logged in user
const meGet = asyncHandler(async (req: Request, res: Response) => {
  assertHasUser(req);
  res.send({
    id: req.user.id,
    name: req.user.name,
  });
});

export { meGet };
