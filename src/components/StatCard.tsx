// File: /components/StatCard.tsx
"use client";

import React from "react";

interface StatCardProps {
  icon: React.ReactNode;
  title: string;
  value: number;
  loading: boolean;
}

const StatCard = ({ icon, title, value, loading }: StatCardProps) => {
  return (
    <div className="bg-white p-4 rounded-xl shadow-sm flex items-center">
      <div className="p-3 bg-blue-100 rounded-full">{icon}</div>
      <div className="ml-4">
        <p className="text-sm font-medium text-gray-600">{title}</p>
        <h3 className="text-2xl font-semibold text-gray-800">
          {loading ? <span className="animate-pulse">•••</span> : value}
        </h3>
      </div>
    </div>
  );
};

export default StatCard;
