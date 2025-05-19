import { Router } from "express";
import { generateTasks } from "../controllers/aiController";

export const aiRoutes = Router();

aiRoutes.post("/", generateTasks);
