import React from "react";
import Image from "next/image";
import { Trash2, Plus, Minus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { CartItem } from "@/types";

interface CartItemProps {
  item: CartItem;
  onQuantityChange: (item: CartItem, quantity: number) => void;
  onRemove: (itemId: string) => void;
}

export const CartItemComponent: React.FC<CartItemProps> = ({
  item,
  onQuantityChange,
  onRemove,
}) => (
  <Card className="overflow-hidden">
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
                onClick={() => onQuantityChange(item, item.quantity - 1)}
                disabled={item.quantity <= 1}
              >
                <Minus className="h-4 w-4" />
              </Button>

              <Input
                type="number"
                value={item.quantity}
                onChange={(e) =>
                  onQuantityChange(item, parseInt(e.target.value))
                }
                className="w-16 text-center"
                min={1}
                max={item.countInStock}
              />

              <Button
                size="icon"
                variant="outline"
                onClick={() => onQuantityChange(item, item.quantity + 1)}
                disabled={item.quantity >= item.countInStock}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>

            <Button
              variant="destructive"
              size="icon"
              onClick={() => onRemove(item._id)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </CardContent>
  </Card>
);
