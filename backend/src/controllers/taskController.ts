// src/controllers/task.controller.ts
import { Request, Response, NextFunction } from "express";
import { db } from "../config/db";
import { tasks } from "../schema/schema";
import { eq } from "drizzle-orm";

export const getAllTasks = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { userId } = req.params;
    const allTasks = await db
      .select()
      .from(tasks)
      .where(eq(tasks.userId, userId));
    res.json(allTasks);
  } catch (err) {
    next(err);
  }
};

export const createTask = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { userId, topic, content } = req.body;
    const result = await db.insert(tasks).values({ userId, topic, content });
    res.status(201).json({ success: true, result });
  } catch (err) {
    next(err);
  }
};

export const updateTask = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const { completed, content } = req.body;
    const result = await db
      .update(tasks)
      .set({ completed, content })
      .where(eq(tasks.id, +id));
    res.json({ success: true, result });
  } catch (err) {
    next(err);
  }
};

export const deleteTask = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const result = await db.delete(tasks).where(eq(tasks.id, +id));
    res.json({ success: true, result });
  } catch (err) {
    next(err);
  }
};
