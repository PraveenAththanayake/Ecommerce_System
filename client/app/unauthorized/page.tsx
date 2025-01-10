"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { AlertCircle } from "lucide-react";

export default function UnauthorizedPage() {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-50">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-lg text-center space-y-6">
        <div className="mx-auto w-12 h-12 text-red-500">
          <AlertCircle className="w-full h-full" />
        </div>

        <h1 className="text-3xl font-bold text-gray-900">
          Unauthorized Access
        </h1>

        <p className="text-gray-600">
          You don&apos;t have the required permissions to access this area.
          Please contact an administrator if you believe this is a mistake.
        </p>

        <div className="pt-4">
          <Button onClick={() => router.push("/")} className="w-full sm:w-auto">
            Return to Home
          </Button>
        </div>
      </div>
    </div>
  );
}
