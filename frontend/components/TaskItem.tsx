"use client";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import axios from "axios";
import { useAuth } from "@/context/AuthContext";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface Task {
  id: string;
  topic: string;
  content: string | string[];
  completed: boolean;
}

export default function TaskItem({
  task,
  onUpdate,
}: {
  task: Task;
  onUpdate: () => void;
}) {
  const { user } = useAuth();
  const [checkedItems, setCheckedItems] = useState<boolean[]>([]);

  useEffect(() => {
    // Load checked state from localStorage
    const savedState = localStorage.getItem(`task-${task.id}-checked`);
    if (savedState) {
      setCheckedItems(JSON.parse(savedState));
    } else {
      // Initialize with all items unchecked
      setCheckedItems(Array(task.content.length).fill(false));
    }
  }, [task.id, task.content.length]);

  // Update all checkboxes when task is completed
  useEffect(() => {
    if (task.completed) {
      setCheckedItems(Array(task.content.length).fill(true));
    }
  }, [task.completed, task.content.length]);

  const handleCheckboxChange = async (index: number) => {
    const newCheckedItems = [...checkedItems];
    newCheckedItems[index] = !newCheckedItems[index];
    setCheckedItems(newCheckedItems);
    localStorage.setItem(
      `task-${task.id}-checked`,
      JSON.stringify(newCheckedItems)
    );

    // If all items are checked, mark task as completed
    if (newCheckedItems.every((item) => item)) {
      await toggleComplete(true);
    } else if (task.completed) {
      // If any item is unchecked and task was completed, mark as incomplete
      await toggleComplete(false);
    }
  };

  const toggleComplete = async (forceState?: boolean) => {
    if (!user) return;
    try {
      const idToken = await user.getIdToken();
      await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/api/tasks/${task.id}`,
        {
          completed: forceState !== undefined ? forceState : !task.completed,
        },
        {
          headers: {
            Authorization: `Bearer ${idToken}`,
            "Content-Type": "application/json",
          },
        }
      );
      toast("Task updated");
      onUpdate();
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };

  const handleDelete = async () => {
    if (!user) return;
    try {
      const idToken = await user.getIdToken();
      await axios.delete(
        `${process.env.NEXT_PUBLIC_API_URL}/api/tasks/${task.id}`,
        {
          headers: {
            Authorization: `Bearer ${idToken}`,
            "Content-Type": "application/json",
          },
        }
      );
      toast("Task deleted");
      onUpdate();
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  return (
    <div className="items-center border p-3 rounded-lg">
      <div className="mb-3">
        <h3 className="font-semibold text-lg mb-2">{task.topic}</h3>
        <ol className="list-decimal list-inside">
          {Array.isArray(task.content) ? (
            task.content.map((item: string, index: number) => (
              <li key={index} className="flex items-center gap-2">
                <Checkbox
                  id={`task-${task.id}-item-${index}`}
                  checked={checkedItems[index]}
                  onCheckedChange={() => handleCheckboxChange(index)}
                  className="mt-1"
                />
                <label
                  htmlFor={`task-${task.id}-item-${index}`}
                  className={`cursor-pointer ${
                    checkedItems[index] ? "line-through text-gray-500" : ""
                  }`}
                >
                  {item}
                </label>
              </li>
            ))
          ) : (
            <li className="flex items-center gap-2">
              <Checkbox
                id={`task-${task.id}-item-0`}
                checked={checkedItems[0]}
                onCheckedChange={() => handleCheckboxChange(0)}
                className="mt-1"
              />
              <label
                htmlFor={`task-${task.id}-item-0`}
                className={`cursor-pointer ${
                  checkedItems[0] ? "line-through text-gray-500" : ""
                }`}
              >
                {task.content}
              </label>
            </li>
          )}
        </ol>
      </div>
      <div className="flex gap-2">
        <Button variant="outline" onClick={() => toggleComplete()}>
          {task.completed ? "Undo" : "Done"}
        </Button>
        <Button variant="destructive" onClick={handleDelete}>
          Delete
        </Button>
      </div>
    </div>
  );
}
