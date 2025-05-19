"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import axios from "axios";
import Navbar from "@/components/Navbar";
import { RiAiGenerate2 } from "react-icons/ri";
import { Pencil, Check, X } from "lucide-react";
import Image from "next/image";

interface GeneratedTask {
  topic: string;
  tasks: string[];
}

export default function HomePage() {
  const router = useRouter();
  const [topic, setTopic] = useState("");
  const [loading, setLoading] = useState(false);
  const [generatedTask, setGeneratedTask] = useState<GeneratedTask | null>(
    null
  );
  const [saving, setSaving] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editedTask, setEditedTask] = useState("");

  const { user } = useAuth();

  if (!user) {
    router.push("/login");
    return null;
  }

  const handleGenerate = async () => {
    if (!topic.trim()) return;
    setLoading(true);
    try {
      const idToken = await user.getIdToken();

      const { data } = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/generate-tasks`,
        { topic },
        {
          headers: {
            Authorization: `Bearer ${idToken}`,
            "Content-Type": "application/json",
          },
        }
      );
      setGeneratedTask(data);
    } catch (err) {
      console.error("Failed to generate:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!generatedTask) return;
    setSaving(true);
    try {
      const idToken = await user.getIdToken();
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/tasks`,
        {
          userId: user.uid,
          topic: generatedTask.topic,
          content: generatedTask.tasks,
        },
        {
          headers: {
            Authorization: `Bearer ${idToken}`,
            "Content-Type": "application/json",
          },
        }
      );
      setGeneratedTask(null);
      setTopic("");
      router.push("/dashboard");
    } catch (err) {
      console.error("Failed to save:", err);
    } finally {
      setSaving(false);
    }
  };

  const startEditing = (index: number, task: string) => {
    setEditingIndex(index);
    setEditedTask(task);
  };

  const saveEdit = (index: number) => {
    if (!generatedTask) return;
    const updatedTasks = [...generatedTask.tasks];
    updatedTasks[index] = editedTask;
    setGeneratedTask({ ...generatedTask, tasks: updatedTasks });
    setEditingIndex(null);
  };

  const cancelEdit = () => {
    setEditingIndex(null);
    setEditedTask("");
  };

  return (
    <>
      <Navbar />
      <main className="relative w-full h-screen overflow-hidden">
        {/* Background Image with Blur */}
        <Image
          src="/bg-image.jpg"
          alt="Background Image"
          width={1920}
          height={1080}
          className="absolute w-full h-full object-cover blur-xs scale-105"
          priority
        />

        {/* Overlay */}
        <div className="absolute top-0 left-0 w-full h-full bg-[#171A1F66]" />

        {/* Content */}
        <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-4 mt-15 md:mt-0">
          <h1 className="text-white text-3xl md:text-5xl font-bold text-center">
            Instantly Turn Ideas into Actionable Tasks
          </h1>
          <p className="text-sm md:text-lg text-white max-w-xl mx-auto mt-2">
            AutoTasker-AI is your intelligent task planning assistant. Input a
            topic and receive 5 focused tasks.
          </p>

          <div className="flex gap-2 md:flex-row flex-col mt-2 mb-6 w-full md:w-1/3">
            <Input
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="e.g. Learn Python"
            />
            <Button
              onClick={handleGenerate}
              disabled={loading}
              className="cursor-pointer"
            >
              {loading ? "Generating..." : "Generate"}
              <RiAiGenerate2 />
            </Button>
          </div>

          {generatedTask && (
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="flex justify-between items-center">
                  <span>{generatedTask.topic}</span>
                  <Button
                    onClick={handleSave}
                    disabled={saving}
                    className="ml-4 cursor-pointer"
                  >
                    {saving ? "Saving..." : "Save Tasks"}
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {generatedTask.tasks.map((task, index) => (
                    <li
                      key={index}
                      className="flex items-start space-x-2 text-gray-700"
                    >
                      <span className="text-blue-500">•</span>
                      {editingIndex === index ? (
                        <div className="flex-1 flex items-center gap-2">
                          <Input
                            value={editedTask}
                            onChange={(e) => setEditedTask(e.target.value)}
                            className="flex-1"
                            autoFocus
                          />
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => saveEdit(index)}
                            className="h-8 w-8 cursor-pointer"
                          >
                            <Check className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={cancelEdit}
                            className="h-8 w-8 cursor-pointer"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ) : (
                        <div className="flex-1 flex items-center justify-between">
                          <span>{task}</span>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => startEditing(index, task)}
                            className="h-8 w-8 cursor-pointer"
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                        </div>
                      )}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </>
  );
}
