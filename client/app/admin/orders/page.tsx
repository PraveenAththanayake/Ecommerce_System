"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Trash2, Eye, Loader2 } from "lucide-react";
import { useOrder } from "@/hooks/useOrder";

const AdminOrdersPage = () => {
  const {
    orders,
    loading,
    error,
    handleGetOrders,
    handleUpdateOrderStatus,
    handleDeleteOrder,
  } = useOrder();

  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    handleGetOrders();
  }, [handleGetOrders]);

  const orderStatuses = [
    "Not Processed",
    "Processing",
    "Dispatched",
    "Cancelled",
    "Completed",
  ];

  const handleStatusUpdate = async (orderId: string, newStatus: string) => {
    try {
      setIsSubmitting(true);
      await handleUpdateOrderStatus(orderId, newStatus);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      setIsSubmitting(true);
      await handleDeleteOrder(id);
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount / 100);
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl mt-12 lg:mt-28">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Orders</h1>
      </div>

      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="space-y-6">
        {loading
          ? Array(3)
              .fill(0)
              .map((_, i) => (
                <Card key={i}>
                  <CardContent className="p-6">
                    <div className="space-y-3">
                      <Skeleton className="h-4 w-1/4" />
                      <Skeleton className="h-4 w-1/2" />
                      <Skeleton className="h-4 w-3/4" />
                    </div>
                  </CardContent>
                </Card>
              ))
          : orders?.map((order) => (
              <Card key={order._id} className="overflow-hidden">
                <CardContent className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-muted-foreground">
                        Order ID
                      </p>
                      <p className="text-sm font-mono">{order._id}</p>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-muted-foreground">
                        Date
                      </p>
                      <p className="text-sm">
                        {new Date(order.createdAt).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </p>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-muted-foreground">
                        Amount
                      </p>
                      <p className="text-sm">
                        {formatCurrency(order.paymentIntent.amount)}
                      </p>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-muted-foreground">
                        Status
                      </p>
                      <Select
                        defaultValue={order.orderStatus}
                        onValueChange={(value) =>
                          handleStatusUpdate(order._id!, value)
                        }
                        disabled={isSubmitting}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {orderStatuses.map((status) => (
                            <SelectItem key={status} value={status}>
                              {status}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="mt-6 flex items-center gap-2">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button size="sm" variant="outline">
                          <Eye size={16} className="mr-2" />
                          View Details
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-3xl">
                        <DialogHeader>
                          <DialogTitle>Order Details</DialogTitle>
                        </DialogHeader>
                        <div className="mt-4 space-y-6">
                          <div>
                            <h3 className="font-semibold mb-2">Products</h3>
                            <div className="space-y-2">
                              {order.products.map(
                                (
                                  item: {
                                    product:
                                      | { name: string; price: number }
                                      | string;
                                    quantity: number;
                                  },
                                  index
                                ) => (
                                  <div
                                    key={index}
                                    className="flex justify-between items-center"
                                  >
                                    <span>
                                      {typeof item.product === "string"
                                        ? `Product ID: ${item.product}`
                                        : item.product.name}{" "}
                                      x {item.quantity}
                                    </span>
                                    <span>
                                      {typeof item.product === "string"
                                        ? "Price not available"
                                        : formatCurrency(
                                            item.product.price * item.quantity
                                          )}
                                    </span>
                                  </div>
                                )
                              )}
                            </div>
                          </div>
                          <div>
                            <h3 className="font-semibold mb-2">
                              Shipping Information
                            </h3>
                            <div className="space-y-1">
                              <p>{order.shippingInfo.address}</p>
                              <p>
                                {order.shippingInfo.city},{" "}
                                {order.shippingInfo.postalCode}
                              </p>
                              <p>{order.shippingInfo.country}</p>
                              <p>Phone: {order.shippingInfo.phoneNo}</p>
                            </div>
                          </div>
                          <div>
                            <h3 className="font-semibold mb-2">Payment Info</h3>
                            <div className="space-y-1">
                              <p>ID: {order.paymentIntent.id}</p>
                              <p>Status: {order.paymentIntent.status}</p>
                              <p>
                                Amount:{" "}
                                {formatCurrency(order.paymentIntent.amount)}
                              </p>
                            </div>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>

                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button size="sm" variant="destructive">
                          <Trash2 size={16} className="mr-2" />
                          Delete
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete Order</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to delete this order? This
                            action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDelete(order._id!)}
                          >
                            {isSubmitting ? (
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            ) : null}
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </CardContent>
              </Card>
            ))}
      </div>
    </div>
  );
};

export default AdminOrdersPage;
