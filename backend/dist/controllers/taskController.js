"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteTask = exports.updateTask = exports.createTask = exports.getAllTasks = void 0;
const db_1 = require("../config/db");
const schema_1 = require("../schema/schema");
const drizzle_orm_1 = require("drizzle-orm");
const getAllTasks = async (req, res, next) => {
    try {
        const { userId } = req.params;
        const allTasks = await db_1.db
            .select()
            .from(schema_1.tasks)
            .where((0, drizzle_orm_1.eq)(schema_1.tasks.userId, userId));
        res.json(allTasks);
    }
    catch (err) {
        next(err);
    }
};
exports.getAllTasks = getAllTasks;
const createTask = async (req, res, next) => {
    try {
        const { userId, topic, content } = req.body;
        const result = await db_1.db.insert(schema_1.tasks).values({ userId, topic, content });
        res.status(201).json({ success: true, result });
    }
    catch (err) {
        next(err);
    }
};
exports.createTask = createTask;
const updateTask = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { completed, content } = req.body;
        const result = await db_1.db
            .update(schema_1.tasks)
            .set({ completed, content })
            .where((0, drizzle_orm_1.eq)(schema_1.tasks.id, +id));
        res.json({ success: true, result });
    }
    catch (err) {
        next(err);
    }
};
exports.updateTask = updateTask;
const deleteTask = async (req, res, next) => {
    try {
        const { id } = req.params;
        const result = await db_1.db.delete(schema_1.tasks).where((0, drizzle_orm_1.eq)(schema_1.tasks.id, +id));
        res.json({ success: true, result });
    }
    catch (err) {
        next(err);
    }
};
exports.deleteTask = deleteTask;
