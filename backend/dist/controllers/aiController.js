"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateTasks = void 0;
const generative_ai_1 = require("@google/generative-ai");
const zod_1 = require("zod");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const genAI = new generative_ai_1.GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const inputSchema = zod_1.z.object({
    topic: zod_1.z.string().min(1, "Topic is required"),
});
const generateTasks = async (req, res) => {
    try {
        const { topic } = inputSchema.parse(req.body);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        const prompt = `Generate a list of 5 concise, actionable tasks to learn about ${topic}. Return only the tasks, no numbering or formatting.`;
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();
        // Split response into separate tasks
        const tasks = text
            .split("\n")
            .map((t) => t.trim())
            .filter((t) => t.length > 0);
        res.status(200).json({ topic, tasks });
    }
    catch (error) {
        console.error("Gemini API Error:", error.message || error);
        if (error instanceof zod_1.z.ZodError) {
            return res.status(400).json({ error: error.errors });
        }
        res
            .status(500)
            .json({ error: "Failed to generate tasks using Gemini API" });
    }
};
exports.generateTasks = generateTasks;
