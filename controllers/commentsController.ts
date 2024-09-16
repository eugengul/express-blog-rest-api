// Controllers for comments
import prisma from "../prisma/prisma.js";
import asyncHandler from "../utils/asyncHanlder.js";
import { Request, Response } from "express";
import { assertHasUser } from "../utils/auth.js";

const getCommentsForPost = asyncHandler(async (req: Request, res: Response) => {
  const { postId } = req.params;
  // Post should exist and be published
  const post = await prisma.post.findUnique({
    where: {
      id: Number(postId),
    },
  });
  if (!post || !post.published) {
    return res.status(404).send({ message: "Post not found" });
  }
  const comments = await prisma.comment.findMany({
    where: {
      postId: Number(postId),
    },
  });
  res.send(comments);
});

const createComment = asyncHandler(async (req: Request, res: Response) => {
  assertHasUser(req);
  const { postId } = req.params;
  const { content } = req.body;

  const post = await prisma.post.findUnique({
    where: {
      id: Number(postId),
    },
  });

  // Comment can only be created if post is published
  if (!post || !post.published) {
    res.status(404).send({ message: "Post not found." });
    return;
  }

  const comment = await prisma.comment.create({
    data: {
      content,
      postId: Number(postId),
      userId: req.user?.id,
    },
  });
  res.status(201).send(comment);
});

const deleteComment = asyncHandler(async (req: Request, res: Response) => {
  assertHasUser(req);
  const { id } = req.params;
  const comment = await prisma.comment.findUnique({
    where: {
      id: Number(id),
    },
  });
  if (!comment) {
    res.status(404).send({ message: "Comment not found." });
    // Only author can delete the comment
  } else if (comment.userId !== req.user?.id) {
    res.status(403).send({ message: "Only author can delete the comment." });
  } else {
    await prisma.comment.delete({
      where: {
        id: Number(id),
      },
    });
    res.status(204).send();
  }
});

export { getCommentsForPost, createComment, deleteComment };
