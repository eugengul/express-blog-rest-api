import prisma from "../prisma/prisma.js";
import { assertHasUser } from "../utils/auth.js";
import { Request, Response } from "express";
import asyncHandler from "../utils/asyncHanlder.js";

// Get all published posts
const getPublishedPosts = asyncHandler(async (req: Request, res: Response) => {
  const posts = await prisma.post.findMany({
    where: {
      published: true,
    },
  });
  res.send(posts);
});

/**
 * Get a post by its id.
 *
 * Only author can access unpublished post.
 */
const getPostById = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const post = await prisma.post.findUnique({
    where: {
      id: Number(id),
    },
  });
  if (!post) {
    res.status(404).send({ message: "Post not found" });
    // Only author can access unpublished post
  } else if (!post.published && post.userId !== req.user?.id) {
    res
      .status(403)
      .send({ message: "Only author can access unpublished post." });
  } else {
    res.send(post);
  }
});

const createPost = asyncHandler(async (req: Request, res: Response) => {
  assertHasUser(req);
  const { title, content, published = false } = req.body;
  const newPost = await prisma.post.create({
    data: {
      title,
      content,
      published,
      userId: req.user.id,
    },
  });
  res.status(201).send(newPost);
});

// Handle put request to update post
const updatePost = asyncHandler(async (req: Request, res: Response) => {
  assertHasUser(req);
  const { id } = req.params;
  const post = await prisma.post.findUnique({
    where: {
      id: Number(id),
    },
  });
  if (!post) {
    res.status(404).send({ message: "Post not found." });
  } else if (post.userId !== req.user?.id) {
    res.status(403).send({ message: "Only author can edit the post." });
  } else {
    const { title, content } = req.body;
    const updatedPost = await prisma.post.update({
      where: {
        id: Number(id),
      },
      data: {
        title,
        content,
      },
    });
    res.send(updatedPost);
  }
});

// Delete post
const deletePost = asyncHandler(async (req: Request, res: Response) => {
  assertHasUser(req);
  const { id } = req.params;
  const post = await prisma.post.findUnique({
    where: {
      id: Number(id),
    },
  });
  if (!post) {
    res.status(404).send({ message: "Post not found." });
    // Only author can delete their post
  } else if (post.userId !== req.user?.id) {
    res.status(403).send({ message: "Only author can delete the post." });
  } else {
    await prisma.post.delete({
      where: {
        id: Number(id),
      },
    });
    res.status(204).send();
  }
});

// Get all posts(published, unpublished) of the user
const postsByUser = asyncHandler(async (req: Request, res: Response) => {
  assertHasUser(req);
  const posts = await prisma.post.findMany({
    where: {
      userId: req.user.id,
    },
  });
  res.send(posts);
});

export {
  getPublishedPosts,
  getPostById,
  createPost,
  updatePost,
  deletePost,
  postsByUser,
};
