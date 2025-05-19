"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.aiRoutes = void 0;
const express_1 = require("express");
const aiController_1 = require("../controllers/aiController");
exports.aiRoutes = (0, express_1.Router)();
exports.aiRoutes.post("/", aiController_1.generateTasks);
