"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  Package,
  Heart,
  ShoppingCart,
  Eye,
  Plus,
  Minus,
} from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useProducts } from "@/hooks/useProduct";
import { IProduct } from "@/types";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store/store";
import {
  addToCart,
  removeFromCart,
  updateCartItemQuantity,
} from "@/store/features/cartSlice";
import {
  addToWishlist,
  removeFromWishlist,
} from "@/store/features/wishlistSlice";
import { toast } from "sonner";

const CategoryProducts = () => {
  const params = useParams();
  const router = useRouter();
  const dispatch = useDispatch();
  const { products, loading, error } = useProducts();
  const [categoryProducts, setCategoryProducts] = useState<IProduct[]>([]);
  const [currentCategory, setCurrentCategory] = useState<string>("");

  const wishlistItems = useSelector((state: RootState) => state.wishlist.items);
  const cartItems = useSelector((state: RootState) => state.cart.items);

  useEffect(() => {
    if (params.slug && products.length > 0) {
      const categoryName = decodeURIComponent(params.slug as string)
        .split("-")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");

      setCurrentCategory(categoryName);
      setCategoryProducts(
        products.filter(
          (product) =>
            product.category.toLowerCase() === categoryName.toLowerCase()
        )
      );
    }
  }, [params.slug, products]);

  const getCartItemQuantity = (productId: string) => {
    const cartItem = cartItems.find((item) => item._id === productId);
    return cartItem?.quantity || 0;
  };

  const handleQuantityChange = (product: IProduct, change: number) => {
    const currentQuantity = getCartItemQuantity(product._id);
    const newQuantity = currentQuantity + change;

    if (newQuantity === 0) {
      dispatch(removeFromCart(product._id));
      toast("Removed from Cart", {
        description: `${product.name} has been removed from your cart.`,
      });
    } else if (newQuantity <= product.countInStock) {
      dispatch(
        updateCartItemQuantity({ id: product._id, quantity: newQuantity })
      );
      toast("Cart Updated", {
        description: `${product.name} quantity updated to ${newQuantity}.`,
      });
    }
  };

  const getStockStatusColor = (count: number) => {
    if (count === 0) return "bg-red-100 text-red-700";
    if (count < 5) return "bg-yellow-100 text-yellow-700";
    return "bg-green-100 text-green-700";
  };

  const handleAddToCart = (product: IProduct) => {
    dispatch(addToCart(product));
    toast("Added to Cart", {
      description: `${product.name} has been added to your cart.`,
    });
  };

  const toggleWishlist = (product: IProduct) => {
    const isInWishlist = wishlistItems.some((item) => item._id === product._id);
    if (isInWishlist) {
      dispatch(removeFromWishlist(product._id));
      toast("Removed from Wishlist", {
        description: "Item has been removed from your wishlist.",
      });
    } else {
      dispatch(addToWishlist(product));
      toast("Added to Wishlist", {
        description: "Item has been added to your wishlist.",
      });
    }
  };

  const isInWishlist = (productId: string) =>
    wishlistItems.some((item) => item._id === productId);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-destructive">{error}</div>
      </div>
    );
  }

  return (
    <section className="py-16 bg-background mt-12 lg:mt-20">
      <div className="max-w-7xl mx-auto px-4">
        <div className="mb-8">
          <Button
            variant="ghost"
            className="mb-6 group"
            onClick={() => router.push("/categories")}
          >
            <ArrowLeft className="h-4 w-4 mr-2 group-hover:-translate-x-1 transition-transform" />
            Back to Categories
          </Button>

          <div className="space-y-2">
            <h1 className="text-3xl lg:text-4xl font-bold">
              {currentCategory}
            </h1>
            <p className="text-muted-foreground">
              {categoryProducts.length} products available
            </p>
          </div>
        </div>

        {categoryProducts.length === 0 ? (
          <div className="text-center py-32 bg-muted/30 rounded-lg">
            <div className="max-w-md mx-auto space-y-4">
              <p className="text-xl font-semibold">No products found</p>
              <p className="text-muted-foreground">
                We couldn&apos;t find any products in this category. Please
                check back later or explore other categories.
              </p>
              <Button
                onClick={() => router.push("/categories")}
                variant="outline"
                className="mt-4"
              >
                Browse Categories
              </Button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {categoryProducts.map((product) => {
              const cartQuantity = getCartItemQuantity(product._id);
              return (
                <Card
                  key={product._id}
                  className="group overflow-hidden border-0 shadow-sm hover:shadow-lg transition-all duration-300"
                >
                  <CardContent className="p-0">
                    <div className="relative">
                      <div className="aspect-[4/3] relative overflow-hidden">
                        <Image
                          src={product.imageUrl}
                          alt={product.name}
                          height={400}
                          width={400}
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                        />

                        <Button
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleWishlist(product);
                          }}
                          size="icon"
                          variant="ghost"
                          className="absolute top-3 right-3 h-8 w-8 rounded-full bg-white/80 hover:bg-white"
                        >
                          <Heart
                            className={`h-4 w-4 ${
                              isInWishlist(product._id)
                                ? "fill-red-500 text-red-500"
                                : "text-gray-600"
                            }`}
                          />
                        </Button>

                        <Badge
                          variant="secondary"
                          className="absolute top-3 left-3 backdrop-blur-sm bg-black/30 text-white"
                        >
                          {product.category}
                        </Badge>

                        <div className="absolute bottom-3 left-3 right-3 flex justify-between items-center">
                          <div
                            className={`px-3 py-1 rounded-full text-xs font-medium ${getStockStatusColor(
                              product.countInStock
                            )}`}
                          >
                            <span className="flex items-center gap-1">
                              <Package className="h-3 w-3" />
                              {product.countInStock} in stock
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="p-4 space-y-3">
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="font-semibold text-lg line-clamp-1 group-hover:text-primary transition-colors">
                          {product.name}
                        </h3>
                        <p className="text-lg font-bold text-primary whitespace-nowrap">
                          ${product.price.toFixed(2)}
                        </p>
                      </div>

                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {product.description}
                      </p>

                      <div className="pt-3 space-y-3 border-t">
                        <div className="flex items-center gap-2">
                          <Badge
                            variant={
                              product.countInStock > 0
                                ? "secondary"
                                : "destructive"
                            }
                            className="text-xs"
                          >
                            {product.countInStock > 0
                              ? "Available"
                              : "Out of Stock"}
                          </Badge>
                          {product.countInStock < 5 &&
                            product.countInStock > 0 && (
                              <Badge
                                variant="outline"
                                className="text-xs text-yellow-600"
                              >
                                Low Stock
                              </Badge>
                            )}
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                          <Button
                            onClick={() =>
                              router.push(
                                `/categories/${currentCategory.toLowerCase()}/${
                                  product._id
                                }`
                              )
                            }
                            variant="outline"
                            size="sm"
                            className="w-full"
                          >
                            <Eye className="h-4 w-4 mr-2" />
                            Details
                          </Button>

                          {cartQuantity > 0 ? (
                            <div className="flex items-center justify-between gap-2 bg-primary/10 rounded-md px-2">
                              <Button
                                size="icon"
                                variant="ghost"
                                className="h-8 w-8"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleQuantityChange(product, -1);
                                }}
                              >
                                <Minus className="h-4 w-4" />
                              </Button>
                              <span className="font-medium">
                                {cartQuantity}
                              </span>
                              <Button
                                size="icon"
                                variant="ghost"
                                className="h-8 w-8"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleQuantityChange(product, 1);
                                }}
                                disabled={cartQuantity >= product.countInStock}
                              >
                                <Plus className="h-4 w-4" />
                              </Button>
                            </div>
                          ) : (
                            <Button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleAddToCart(product);
                              }}
                              disabled={product.countInStock === 0}
                              size="sm"
                              className="w-full"
                            >
                              <ShoppingCart className="h-4 w-4 mr-2" />
                              Add to Cart
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};

export default CategoryProducts;
