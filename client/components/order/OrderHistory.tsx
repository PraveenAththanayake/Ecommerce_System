import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { IOrder } from "@/types";
import { STATUS_COLORS } from "@/constants/constants";

interface OrderHistoryProps {
  orders: IOrder[];
}

export const OrderHistory: React.FC<OrderHistoryProps> = ({ orders }) => {
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);

  if (!orders || !orders.length) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">No previous orders found</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Order History</h2>
      {orders.map((order) => (
        <Card key={order._id}>
          <CardContent className="p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="font-semibold">Order #{order._id}</p>
                <p className="text-sm text-muted-foreground">
                  Placed on {order.createdAt}
                </p>
              </div>
              <div className="flex flex-col items-end">
                <span
                  className={`px-3 py-1 rounded-full text-sm ${
                    STATUS_COLORS[
                      order.orderStatus as keyof typeof STATUS_COLORS
                    ]
                  }`}
                >
                  {order.orderStatus.charAt(0).toUpperCase() +
                    order.orderStatus.slice(1)}
                </span>
                <p className="font-bold mt-2">
                  Total: ${(order.paymentIntent.amount / 100).toFixed(2)}
                </p>
              </div>
            </div>

            <Button
              variant="outline"
              onClick={() =>
                setExpandedOrderId(
                  expandedOrderId === order._id ? null : order._id || null
                )
              }
              className="w-full"
            >
              {expandedOrderId === order._id ? "Hide Details" : "Show Details"}
            </Button>

            {expandedOrderId === order._id && (
              <div className="mt-4 space-y-4">
                <div>
                  <h3 className="font-semibold mb-2">Products</h3>
                  <div className="space-y-2">
                    {order.products.map((item) => (
                      <div key={item.product} className="flex justify-between">
                        <span>{item.name}</span>
                        <span>x{item.quantity}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">Shipping Address</h3>
                  <p>{order.shippingInfo.address}</p>
                  <p>
                    {order.shippingInfo.city}, {order.shippingInfo.postalCode}
                  </p>
                  <p>{order.shippingInfo.country}</p>
                  <p>Phone: {order.shippingInfo.phoneNo}</p>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">Payment Information</h3>
                  <p>Status: {order.paymentIntent.status}</p>
                  <p>ID: {order.paymentIntent.id}</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
