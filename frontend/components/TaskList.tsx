"use client";

import { useEffect, useState } from "react";
import TaskItem from "./TaskItem";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { useAuth } from "@/context/AuthContext";
import { BeatLoader } from "react-spinners";

type FilterType = "all" | "completed" | "incomplete";

interface Task {
  id: string;
  topic: string;
  content: string | string[];
  completed: boolean;
}

export default function TaskList({ userId }: { userId: string }) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filter, setFilter] = useState<FilterType>("all");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const fetchTasks = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const idToken = await user?.getIdToken();
      const { data } = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/api/tasks/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${idToken}`,
          },
        }
      );
      console.log(data);
      setTasks(data || []);
    } catch (error) {
      console.error("Failed to fetch tasks:", error);
      setError("Failed to load tasks");
      setTasks([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const completedCount = tasks.filter((task) => task.completed).length;
  const percentComplete =
    tasks.length > 0 ? (completedCount / tasks.length) * 100 : 0;

  const filteredTasks = tasks.filter((task) => {
    if (filter === "completed") return task.completed;
    if (filter === "incomplete") return !task.completed;
    return true;
  });

  if (isLoading) {
    return (
      <div className="text-center">
        Loading tasks...
        <BeatLoader />
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-medium mb-1">
          Progress: {Math.round(percentComplete)}%
        </p>
        <Progress value={percentComplete} />
      </div>

      {/* Filter Buttons */}
      <div className="flex gap-2">
        <Button
          variant={filter === "all" ? "default" : "outline"}
          onClick={() => setFilter("all")}
        >
          All
        </Button>
        <Button
          variant={filter === "completed" ? "default" : "outline"}
          onClick={() => setFilter("completed")}
        >
          Completed
        </Button>
        <Button
          variant={filter === "incomplete" ? "default" : "outline"}
          onClick={() => setFilter("incomplete")}
        >
          Incomplete
        </Button>
      </div>

      {/* Task List */}
      {filteredTasks.length === 0 ? (
        <p className="text-gray-500 text-sm">No tasks to display.</p>
      ) : (
        filteredTasks.map((task) => (
          <TaskItem key={task.id} task={task} onUpdate={fetchTasks} />
        ))
      )}
    </div>
  );
}
