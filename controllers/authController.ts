import bcrypt from "bcrypt";
import { NextFunction, Request, Response } from "express";
import { Prisma } from "@prisma/client";

import prisma from "../prisma/prisma.js";
import { generateAccessToken } from "../utils/auth.js";
import asyncHandler from "../utils/asyncHanlder.js";

// Create new user
const signUpPost = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { username, password } = req.body;
      if (!username || !password)
        res.status(400).send({ message: "Missing username or password" });
      // Try to create new user in DB
      const hashedPassword = await bcrypt.hash(password, 10);
      await prisma.user.create({
        data: {
          name: username,
          password: hashedPassword,
        },
      });
      res.status(201).send("The user has been successfully created.");
    } catch (err: unknown) {
      // If username(unique) already in use(error code P2002)
      if (
        err instanceof Prisma.PrismaClientKnownRequestError &&
        err.code === "P2002"
      ) {
        res.status(409).send({ message: "Username already in use" });
      }
      next(err);
    }
  },
);

// Login user and return jwt token
const loginPost = asyncHandler(async (req: Request, res: Response) => {
  const { username, password } = req.body;
  // Check if user exists
  const user = await prisma.user.findUnique({
    where: {
      name: username,
    },
  });
  // Check password hash
  if (user && (await bcrypt.compare(password, user.password))) {
    // Generate and return jwt token
    const token = generateAccessToken(user);
    res.send({ token });
  } else {
    res.status(401).send("Wrong username or password.");
  }
});

export { signUpPost, loginPost };
