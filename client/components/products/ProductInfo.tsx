import { Package, Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { IProduct, IReview } from "@/types";
import { AddToCart } from "./AddToCart";

interface ProductInfoProps {
  product: IProduct;
  reviews: IReview[];
  onAddToCart: () => void;
  onQuantityChange: (change: number) => void;
  cartItemQuantity: number;
}

export function ProductInfo({
  product,
  reviews,
  onAddToCart,
  onQuantityChange,
  cartItemQuantity,
}: ProductInfoProps) {
  return (
    <div className="space-y-6">
      <div>
        <Badge variant="secondary">{product.category}</Badge>
        <h1 className="mt-2 text-3xl font-bold">{product.name}</h1>
        <div className="mt-4 flex items-center gap-4">
          <p className="text-2xl font-bold text-primary">
            ${product.price.toFixed(2)}
          </p>
          <div className="flex items-center gap-1">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`h-4 w-4 ${
                    i < (product.rating || 0)
                      ? "fill-yellow-400 text-yellow-400"
                      : "text-gray-300"
                  }`}
                />
              ))}
            </div>
            <span className="text-sm text-muted-foreground">
              ({reviews.length} reviews)
            </span>
          </div>
        </div>
      </div>

      <p className="text-muted-foreground">{product.description}</p>

      <div className="flex items-center gap-2">
        <Package className="h-4 w-4" />
        <span
          className={`text-sm font-medium ${
            product.countInStock > 0 ? "text-green-600" : "text-red-600"
          }`}
        >
          {product.countInStock > 0
            ? `${product.countInStock} in stock`
            : "Out of stock"}
        </span>
      </div>

      <AddToCart
        product={product}
        quantity={cartItemQuantity}
        onAdd={onAddToCart}
        onQuantityChange={onQuantityChange}
      />
    </div>
  );
}
