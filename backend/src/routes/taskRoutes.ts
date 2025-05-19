// src/routes/taskRoutes.ts
import { Router } from "express";
import {
  getAllTasks,
  createTask,
  updateTask,
  deleteTask,
} from "../controllers/taskController";

export const taskRoutes = Router();

taskRoutes.get("/:userId", getAllTasks); // Get all tasks for a user
taskRoutes.post("/", createTask); // Create a task
taskRoutes.put("/:id", updateTask); // Update a task
taskRoutes.delete("/:id", deleteTask); // Delete a task
