"use client";

import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";

const Dashboard = () => {
  const user = useSelector((state: RootState) => state.auth.user);

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 bg-secondary/10">
      <div className="max-w-4xl mx-auto space-y-4">
        <h1>Welcome, {user.email}</h1>
        <p>Your role: {user.role}</p>
        <p>Your ID: {user._id}</p>
      </div>
    </div>
  );
};

export default Dashboard;
