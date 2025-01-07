import Image from "next/image";
import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { IProduct } from "@/types";

interface ProductImageProps {
  product: IProduct;
  isInWishlist: boolean;
  onWishlistToggle: () => void;
}

export function ProductImage({
  product,
  isInWishlist,
  onWishlistToggle,
}: ProductImageProps) {
  return (
    <div className="relative">
      <div className="aspect-square relative overflow-hidden rounded-lg">
        <Image
          src={product.imageUrl}
          alt={product.name}
          fill
          className="object-cover"
        />
        <Button
          onClick={onWishlistToggle}
          size="icon"
          variant="ghost"
          className="absolute top-4 right-4 h-10 w-10 rounded-full bg-white/80 hover:bg-white"
        >
          <Heart
            className={`h-5 w-5 ${
              isInWishlist ? "fill-red-500 text-red-500" : "text-gray-600"
            }`}
          />
        </Button>
      </div>
    </div>
  );
}
