"use client";

import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Trash2, Plus, Minus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";

import {
  removeFromCart,
  updateQuantity,
  clearCart,
} from "@/store/features/cartSlice";
import { CartItem, IOrder } from "@/types";
import { RootState } from "@/store/store";
import { useOrder } from "@/hooks/useOrder";
import { OrderHistory } from "@/components/order/OrderHistory";
import { OrderSummary } from "@/components/order/OrderSummary";

const OrderPage = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const { handleCreateOrder, orders, loading, error, handleGetUserOrders } =
    useOrder();
  const cartItems = useSelector((state: RootState) => state.cart.items);
  const [orderTotal, setOrderTotal] = useState(0);

  useEffect(() => {
    handleGetUserOrders();
  }, [handleGetUserOrders]);

  useEffect(() => {
    const total = cartItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    setOrderTotal(total);
  }, [cartItems]);

  const handleQuantityChange = (item: CartItem, newQuantity: number) => {
    if (newQuantity > 0 && newQuantity <= item.countInStock) {
      dispatch(updateQuantity({ id: item._id, quantity: newQuantity }));
    }
  };

  const handleRemoveItem = (itemId: string) => {
    dispatch(removeFromCart(itemId));
  };

  const handleCheckout = async (orderData: Omit<IOrder, "user">) => {
    try {
      await handleCreateOrder(orderData);
      dispatch(clearCart());
      router.push("/order");
    } catch (error) {
      console.error("Checkout failed:", error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg">Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-500">Error: {error}</p>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 mt-12 lg:mt-20">
        <div className="text-center space-y-4 mb-12">
          <h2 className="text-2xl font-bold">Your cart is empty</h2>
          <p className="text-muted-foreground">Add some items to get started</p>
          <Button onClick={() => router.push("/categories")}>
            Continue Shopping
          </Button>
        </div>
        <Separator className="my-8" />
        {orders && <OrderHistory orders={orders} />}
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-16 mt-12 lg:mt-20">
      <h1 className="text-3xl font-bold mb-8">Your Cart</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          {cartItems.map((item) => (
            <Card key={item._id} className="overflow-hidden">
              <CardContent className="p-4">
                <div className="flex gap-4">
                  <div className="relative w-24 h-24">
                    <Image
                      src={item.imageUrl}
                      alt={item.name}
                      fill
                      className="object-cover rounded"
                    />
                  </div>

                  <div className="flex-1 space-y-2">
                    <div className="flex justify-between">
                      <h3 className="font-semibold">{item.name}</h3>
                      <p className="font-bold">
                        ${(item.price * item.quantity).toFixed(2)}
                      </p>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <Button
                          size="icon"
                          variant="outline"
                          onClick={() =>
                            handleQuantityChange(item, item.quantity - 1)
                          }
                          disabled={item.quantity <= 1}
                        >
                          <Minus className="h-4 w-4" />
                        </Button>

                        <Input
                          type="number"
                          value={item.quantity}
                          onChange={(e) =>
                            handleQuantityChange(item, parseInt(e.target.value))
                          }
                          className="w-16 text-center"
                          min={1}
                          max={item.countInStock}
                        />

                        <Button
                          size="icon"
                          variant="outline"
                          onClick={() =>
                            handleQuantityChange(item, item.quantity + 1)
                          }
                          disabled={item.quantity >= item.countInStock}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>

                      <Button
                        variant="destructive"
                        size="icon"
                        onClick={() => handleRemoveItem(item._id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="lg:col-span-1 space-y-8">
          <OrderSummary
            orderTotal={orderTotal}
            cartItems={cartItems}
            onCheckout={handleCheckout}
          />

          <OrderHistory orders={orders || []} />
        </div>
      </div>
    </div>
  );
};

export default OrderPage;
