import { Plus, Minus, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { IProduct } from "@/types";

interface AddToCartProps {
  product: IProduct;
  quantity: number;
  onAdd: () => void;
  onQuantityChange: (change: number) => void;
}

export function AddToCart({
  product,
  quantity,
  onAdd,
  onQuantityChange,
}: AddToCartProps) {
  return (
    <div className="flex items-center gap-4">
      {quantity > 0 ? (
        <div className="flex items-center justify-between gap-4 bg-primary/10 rounded-md px-4 py-2">
          <Button
            size="icon"
            variant="ghost"
            onClick={() => onQuantityChange(-1)}
          >
            <Minus className="h-4 w-4" />
          </Button>
          <span className="font-medium text-lg w-8 text-center">
            {quantity}
          </span>
          <Button
            size="icon"
            variant="ghost"
            onClick={() => onQuantityChange(1)}
            disabled={quantity >= product.countInStock}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        <Button
          onClick={onAdd}
          disabled={product.countInStock === 0}
          size="lg"
          className="w-full"
        >
          <ShoppingCart className="h-5 w-5 mr-2" />
          Add to Cart
        </Button>
      )}
    </div>
  );
}
