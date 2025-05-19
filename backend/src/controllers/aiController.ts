import { GoogleGenerativeAI } from "@google/generative-ai";
import { Request, Response } from "express";
import { z } from "zod";
import dotenv from "dotenv";

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

const inputSchema = z.object({
  topic: z.string().min(1, "Topic is required"),
});

export const generateTasks = async (req: Request, res: Response) => {
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
  } catch (error: any) {
    console.error("Gemini API Error:", error.message || error);
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors });
    }
    res
      .status(500)
      .json({ error: "Failed to generate tasks using Gemini API" });
  }
};
