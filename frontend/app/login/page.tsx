"use client";

import AuthForm from "@/components/AuthForm";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="bg-white shadow-md rounded-xl p-6 w-full max-w-md">
        <h1 className="text-2xl font-semibold text-center mb-4">
          AutoTasker AI
        </h1>
        <AuthForm />
      </div>
    </div>
  );
}
