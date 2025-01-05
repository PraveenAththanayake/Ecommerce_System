"use client";

import React from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ShoppingBag,
  Box,
  MessageCircle,
  ClipboardList,
  Star,
  Users,
  Settings,
  TrendingUp,
} from "lucide-react";

const AdminDashboard = () => {
  const router = useRouter();

  const adminFeatures = [
    {
      title: "Categories",
      description: "Manage product categories and organization",
      icon: <Box />,
      path: "/admin/category",
      color: "bg-blue-500/10 text-blue-500",
    },
    {
      title: "Products",
      description: "Handle inventory and product details",
      icon: <ShoppingBag />,
      path: "/admin/products",
      color: "bg-green-500/10 text-green-500",
    },
    {
      title: "Orders",
      description: "Track and process customer orders",
      icon: <ClipboardList />,
      path: "/admin/orders",
      color: "bg-purple-500/10 text-purple-500",
    },
    {
      title: "Inquiries",
      description: "Respond to customer questions",
      icon: <MessageCircle />,
      path: "/admin/inquiries",
      color: "bg-yellow-500/10 text-yellow-500",
    },
    {
      title: "Reviews",
      description: "Monitor and moderate reviews",
      icon: <Star />,
      path: "/admin/reviews",
      color: "bg-orange-500/10 text-orange-500",
    },
    {
      title: "Users",
      description: "Manage customer accounts",
      icon: <Users />,
      path: "/admin/users",
      color: "bg-red-500/10 text-red-500",
    },
    {
      title: "Settings",
      description: "Customize platform settings",
      icon: <Settings />,
      path: "/admin/settings",
      color: "bg-gray-500/10 text-gray-500",
    },
  ];

  const quickStats = [
    {
      title: "Total Products",
      value: "1,234",
      trend: "+12%",
      trendColor: "text-green-500",
    },
    {
      title: "Active Orders",
      value: "56",
      trend: "+23%",
      trendColor: "text-green-500",
    },
    {
      title: "Pending Inquiries",
      value: "23",
      trend: "-5%",
      trendColor: "text-red-500",
    },
    {
      title: "New Reviews",
      value: "12",
      trend: "+8%",
      trendColor: "text-green-500",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50/50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="mb-8 space-y-2">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
            Admin Dashboard
          </h1>
          <p className="text-gray-500 text-sm sm:text-base">
            Manage and monitor your e-commerce platform
          </p>
        </div>

        {/* Quick Stats Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {quickStats.map((stat) => (
            <Card
              key={stat.title}
              className="border-none shadow-sm hover:shadow-md transition-all"
            >
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-500">
                  {stat.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-gray-900">
                    {stat.value}
                  </span>
                  <div
                    className={`flex items-center ${stat.trendColor} text-sm`}
                  >
                    <TrendingUp className="w-4 h-4 mr-1" />
                    {stat.trend}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {adminFeatures.map((feature) => (
            <Card
              key={feature.title}
              className="border-none shadow-sm hover:shadow-md transition-all cursor-pointer group"
              onClick={() => router.push(feature.path)}
            >
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <CardTitle className="text-base sm:text-lg font-semibold">
                      {feature.title}
                    </CardTitle>
                    <CardDescription className="text-sm text-gray-500 line-clamp-2">
                      {feature.description}
                    </CardDescription>
                  </div>
                  <div
                    className={`p-2 rounded-lg ${feature.color} transition-colors`}
                  >
                    {React.cloneElement(feature.icon, { className: "w-5 h-5" })}
                  </div>
                </div>
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
