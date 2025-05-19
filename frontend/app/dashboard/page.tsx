"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import TaskList from "@/components/TaskList";
import Navbar from "@/components/Navbar";

export default function DashboardPage() {
  const router = useRouter();
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    router.push("/login");
    return null;
  }

  return (
    <>
      <Navbar />
      <div className="max-w-3xl mt-20 mx-auto p-4 space-y-6">
        <h1 className="text-2xl font-bold text-center">Your Task Dashboard</h1>
        <TaskList userId={user.uid} />
      </div>
    </>
  );
}
