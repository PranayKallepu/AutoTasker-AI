import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { taskRoutes } from "./routes/taskRoutes";
import { aiRoutes } from "./routes/aiRoutes";
import { verifyFirebaseToken } from "./middlewares/auth";

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/tasks", verifyFirebaseToken, taskRoutes);
app.use("/api/generate-tasks", verifyFirebaseToken, aiRoutes);

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
