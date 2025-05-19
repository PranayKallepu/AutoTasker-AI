"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.taskRoutes = void 0;
// src/routes/taskRoutes.ts
const express_1 = require("express");
const taskController_1 = require("../controllers/taskController");
exports.taskRoutes = (0, express_1.Router)();
exports.taskRoutes.get("/:userId", taskController_1.getAllTasks); // Get all tasks for a user
exports.taskRoutes.post("/", taskController_1.createTask); // Create a task
exports.taskRoutes.put("/:id", taskController_1.updateTask); // Update a task
exports.taskRoutes.delete("/:id", taskController_1.deleteTask); // Delete a task
