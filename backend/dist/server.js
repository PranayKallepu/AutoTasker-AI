"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const taskRoutes_1 = require("./routes/taskRoutes");
const aiRoutes_1 = require("./routes/aiRoutes");
const auth_1 = require("./middlewares/auth");
dotenv_1.default.config();
const app = (0, express_1.default)();
const port = process.env.PORT || 3001;
// Middleware
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// Routes
app.use("/api/tasks", auth_1.verifyFirebaseToken, taskRoutes_1.taskRoutes);
app.use("/api/generate-tasks", auth_1.verifyFirebaseToken, aiRoutes_1.aiRoutes);
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
