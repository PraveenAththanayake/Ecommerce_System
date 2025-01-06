"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store/store";
import {
  Heart,
  ShoppingCart,
  Plus,
  Minus,
  ArrowLeft,
  Package,
  Star,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { useProducts } from "@/hooks/useProduct";
import { IProduct, IReview } from "@/types";
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
import { useForm } from "react-hook-form";

interface ReviewFormData {
  rating: number;
  comment: string;
}

const ProductDetail = () => {
  const params = useParams();
  const router = useRouter();
  const dispatch = useDispatch();
  const { products, loading, error } = useProducts();
  const [product, setProduct] = useState<IProduct | null>(null);
  const [reviews, setReviews] = useState<IReview[]>([]);

  const wishlistItems = useSelector((state: RootState) => state.wishlist.items);
  const cartItems = useSelector((state: RootState) => state.cart.items);

  const form = useForm<{ rating: number; comment: string }>({
    defaultValues: { rating: 5, comment: "" },
  });

  useEffect(() => {
    if (params.productId && products.length > 0) {
      const foundProduct = products.find((p) => p._id === params.productId);
      if (foundProduct) {
        setProduct(foundProduct);
        setReviews(foundProduct.reviews || []);
      }
    }
  }, [params.productId, products]);

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
      toast("Removed from Wishlist");
    } else {
      dispatch(addToWishlist(product));
      toast("Added to Wishlist");
    }
  };

  const isInWishlist = (productId: string) =>
    wishlistItems.some((item) => item._id === productId);

  const onSubmitReview = (data: ReviewFormData) => {
    // In a real app, send to API
    if (product) {
      const newReview: IReview = {
        id: Date.now().toString(),
        rating: data.rating,
        comment: data.comment,
        userName: "Current User",
        createdAt: new Date().toISOString(),
        user: "Current User",
        product: product._id,
        name: product.name,
      };
      setReviews([...reviews, newReview]);
      form.reset();
      toast("Review Added", {
        description: "Thank you for your feedback!",
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Loading...</div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-destructive">{error || "Product not found"}</div>
      </div>
    );
  }

  const cartQuantity = getCartItemQuantity(product._id);

  const StarRating = ({
    rating,
    onRatingChange,
  }: {
    rating: number;
    onRatingChange: (rating: number) => void;
  }) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => onRatingChange(star)}
            className="focus:outline-none"
          >
            <Star
              className={`h-6 w-6 ${
                star <= rating
                  ? "fill-yellow-400 text-yellow-400"
                  : "text-gray-300"
              } hover:fill-yellow-400 hover:text-yellow-400 transition-colors`}
            />
          </button>
        ))}
      </div>
    );
  };

  return (
    <section className="py-16 bg-background mt-12 lg:mt-20">
      <div className="max-w-7xl mx-auto px-4">
        <Button
          variant="ghost"
          className="mb-8 group"
          onClick={() => router.back()}
        >
          <ArrowLeft className="h-4 w-4 mr-2 group-hover:-translate-x-1 transition-transform" />
          Back
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Image */}
          <div className="relative">
            <div className="aspect-square relative overflow-hidden rounded-lg">
              <Image
                src={product.imageUrl}
                alt={product.name}
                fill
                className="object-cover"
              />
              <Button
                onClick={() => toggleWishlist(product)}
                size="icon"
                variant="ghost"
                className="absolute top-4 right-4 h-10 w-10 rounded-full bg-white/80 hover:bg-white"
              >
                <Heart
                  className={`h-5 w-5 ${
                    isInWishlist(product._id)
                      ? "fill-red-500 text-red-500"
                      : "text-gray-600"
                  }`}
                />
              </Button>
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <Badge variant="secondary">{product.category}</Badge>
              <h1 className="mt-2 text-3xl font-bold">{product.name}</h1>
              <div className="mt-4 flex items-center gap-4">
                <p className="text-2xl font-bold text-primary">
                  ${product.price.toFixed(2)}
                </p>
                <div className="flex items-center gap-1">
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

            <div className="flex items-center gap-4">
              {cartQuantity > 0 ? (
                <div className="flex items-center justify-between gap-4 bg-primary/10 rounded-md px-4 py-2">
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => handleQuantityChange(product, -1)}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="font-medium text-lg w-8 text-center">
                    {cartQuantity}
                  </span>
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => handleQuantityChange(product, 1)}
                    disabled={cartQuantity >= product.countInStock}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <Button
                  onClick={() => handleAddToCart(product)}
                  disabled={product.countInStock === 0}
                  size="lg"
                  className="w-full"
                >
                  <ShoppingCart className="h-5 w-5 mr-2" />
                  Add to Cart
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold mb-8">Customer Reviews</h2>

          {/* Review Form */}
          <Card className="mb-8">
            <CardContent className="pt-6">
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmitReview)}
                  className="space-y-4"
                >
                  <FormField
                    control={form.control}
                    name="rating"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Rating</FormLabel>
                        <FormControl>
                          <StarRating
                            rating={field.value}
                            onRatingChange={(value) => field.onChange(value)}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="comment"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Your Review</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Share your thoughts about this product..."
                            className="resize-none"
                            {...field}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <Button type="submit">Submit Review</Button>
                </form>
              </Form>
            </CardContent>
          </Card>

          {/* Reviews List */}
          <div className="space-y-6">
            {reviews.length === 0 ? (
              <p className="text-center text-muted-foreground py-12">
                No reviews yet. Be the first to review this product!
              </p>
            ) : (
              reviews.map((review) => (
                <Card key={review.id}>
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <p className="font-semibold">{review.userName}</p>
                        <div className="flex items-center gap-2">
                          <div className="flex">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`h-4 w-4 ${
                                  i < review.rating
                                    ? "fill-yellow-400 text-yellow-400"
                                    : "text-gray-300"
                                }`}
                              />
                            ))}
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {new Date(review.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </div>
                    <p className="text-muted-foreground">{review.comment}</p>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProductDetail;
