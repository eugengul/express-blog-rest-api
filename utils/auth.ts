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

// Middleware validates token and adds user to request or set user to null
const validateAccessToken = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { authorization } = req.headers;
  // If user is not authenticated, set user to null
  req.user = null;
  // Authorization header has format "Bearer <token>"
  if (authorization && authorization.startsWith("Bearer ")) {
    const token = authorization.split(" ")[1];
    try {
      // Verify token and check if user with this id exists
      const { id } = jwt.verify(token, config.JWT_SECRET) as JwtPayload;
      const user = await prisma.user.findUnique({ where: { id: id } });
      // If user exists, add user to request
      if (user) req.user = user;
    } catch (error: unknown) {
      if (error instanceof Error && error.name === "TokenExpiredError") {
        console.log("Token expired:", error);
      } else {
        console.error("Token verification failed:", error);
      }
    }
  }
  next();
};

// Middleware prevents unauthorized access
const userRequired = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (!req.user) {
    res.status(401).send({ message: "Unauthorized" });
  } else {
    next();
  }
};

// Assertion function ensures that user is in the request
function assertHasUser(req: Request): asserts req is Request & { user: User } {
  if (!req.user) {
    throw new Error("User not found in request");
  }
}

export {
  generateAccessToken,
  validateAccessToken,
  assertHasUser,
  userRequired,
};
