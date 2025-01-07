import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { CheckoutDialog } from "./CheckoutDialog";
import { CartItem, IOrder } from "@/types";

interface OrderSummaryProps {
  orderTotal: number;
  cartItems: CartItem[];
  onCheckout: (orderData: Omit<IOrder, "user">) => Promise<void>;
}

export const OrderSummary: React.FC<OrderSummaryProps> = ({
  orderTotal,
  cartItems,
  onCheckout,
}) => (
  <Card>
    <CardContent className="p-6 space-y-4">
      <h2 className="text-xl font-bold">Order Summary</h2>

      <div className="space-y-2">
        <div className="flex justify-between">
          <span>Subtotal</span>
          <span>${orderTotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between">
          <span>Shipping</span>
          <span>FREE</span>
        </div>
        <div className="flex justify-between font-bold text-lg pt-2 border-t">
          <span>Total</span>
          <span>${orderTotal.toFixed(2)}</span>
        </div>
      </div>

      <CheckoutDialog cartItems={cartItems} onCheckout={onCheckout} />
    </CardContent>
  </Card>
);
