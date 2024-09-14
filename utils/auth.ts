// JWT access token generation and validation
import { User } from "@prisma/client";
import { Request, NextFunction, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import prisma from "../prisma/prisma.js";

import config from "../config.js";

function generateAccessToken(user: User) {
  return jwt.sign({ id: user.id }, config.JWT_SECRET, {
    expiresIn: config.JWT_EXPIRES_IN,
  });
}

// Middleware validates token and adds user to request
const validateAccessToken = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { authorization } = req.headers;
  // Authorization header has format "Bearer <token>"
  if (!authorization || !authorization.startsWith("Bearer ")) {
    res.status(401).send({ message: "Unauthorized" });
  } else {
    const token = authorization.split(" ")[1];
    try {
      const { id } = jwt.verify(token, config.JWT_SECRET) as JwtPayload;
      const user = await prisma.user.findUnique({ where: { id: id } });
      if (!user) {
        res.status(401).send({ message: "Unauthorized" });
        return;
      }
      req.user = user;
      next();
    } catch {
      res.status(401).send({ message: "Unauthorized" });
    }
  }
};

// Assertion function ensures that user is in the request
function assertHasUser(req: Request): asserts req is Request & { user: User } {
  if (!req.user) {
    throw new Error("User not found in request");
  }
}

export { generateAccessToken, validateAccessToken, assertHasUser };
