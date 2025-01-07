import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  DialogContent,
  DialogHeader,
  DialogTitle,
  Dialog,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useUser } from "@/context/UserContext";
import { CartItem, ShippingInfo, IOrder } from "@/types";

interface CheckoutDialogProps {
  cartItems: CartItem[];
  onCheckout: (orderData: Omit<IOrder, "user">) => Promise<void>;
}

export const CheckoutDialog: React.FC<CheckoutDialogProps> = ({
  cartItems,
  onCheckout,
}) => {
  const { user } = useUser();
  const [shippingInfo, setShippingInfo] = useState<ShippingInfo>({
    address: user?.address || "",
    city: "",
    phoneNo: "",
    postalCode: "",
    country: "",
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const orderData = {
      products: cartItems.map((item) => ({
        product: item._id,
        name: item.name,
        quantity: item.quantity,
      })),
      shippingInfo,
      paymentIntent: {
        id: `pi_${Date.now()}`,
        status: "succeeded",
        amount: cartItems.reduce(
          (sum, item) => sum + item.price * item.quantity * 100,
          0
        ),
      },
      orderStatus: "Not Processed",
      createdAt: new Date().toISOString(),
      totalAmount: cartItems.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
      ),
    };
    await onCheckout(orderData);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="w-full" size="lg" disabled={cartItems.length === 0}>
          Proceed to Checkout
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Shipping Details</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="address">Address</Label>
            <Input
              id="address"
              value={shippingInfo.address}
              onChange={(e) =>
                setShippingInfo((prev) => ({
                  ...prev,
                  address: e.target.value,
                }))
              }
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="city">City</Label>
              <Input
                id="city"
                value={shippingInfo.city}
                onChange={(e) =>
                  setShippingInfo((prev) => ({ ...prev, city: e.target.value }))
                }
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="postalCode">Postal Code</Label>
              <Input
                id="postalCode"
                value={shippingInfo.postalCode}
                onChange={(e) =>
                  setShippingInfo((prev) => ({
                    ...prev,
                    postalCode: e.target.value,
                  }))
                }
                required
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="country">Country</Label>
            <Input
              id="country"
              value={shippingInfo.country}
              onChange={(e) =>
                setShippingInfo((prev) => ({
                  ...prev,
                  country: e.target.value,
                }))
              }
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phoneNo">Phone Number</Label>
            <Input
              id="phoneNo"
              type="tel"
              value={shippingInfo.phoneNo}
              onChange={(e) =>
                setShippingInfo((prev) => ({
                  ...prev,
                  phoneNo: e.target.value,
                }))
              }
              required
            />
          </div>
          <Button type="submit" className="w-full">
            Place Order
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};
