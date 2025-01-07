"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useProducts } from "@/hooks/useProduct";
import { useReview } from "@/hooks/useReview";
import { useUser } from "@/context/UserContext";
import { IProduct, IReview, ReviewFormData } from "@/types";
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
import { ProductImage } from "@/components/products/ProductImage";
import { ProductInfo } from "@/components/products/ProductInfo";
import { ReviewForm } from "@/components/review/ReviewForm";
import ReviewList from "@/components/review/ReviewList";

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const dispatch = useDispatch();

  // Hooks
  const { user, loading: userLoading } = useUser();
  const {
    products,
    loading: productsLoading,
    error: productsError,
  } = useProducts();
  const {
    handleCreateReview,
    handleUpdateReview,
    handleDeleteReview,
    fetchReviews,
    loading: reviewsLoading,
    error: reviewsError,
  } = useReview();

  // Local state
  const [product, setProduct] = useState<IProduct | null>(null);
  const [reviews, setReviews] = useState<IReview[]>([]);
  const [editingReview, setEditingReview] = useState<IReview | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  // Redux state
  const wishlistItems = useSelector((state: RootState) => state.wishlist.items);
  const cartItems = useSelector((state: RootState) => state.cart.items);

  // Forms
  const newReviewForm = useForm<ReviewFormData>({
    defaultValues: { rating: 5, comment: "" },
  });

  const editReviewForm = useForm<ReviewFormData>({
    defaultValues: { rating: 5, comment: "" },
  });

  // Load product and reviews
  useEffect(() => {
    if (params.productId && products.length > 0) {
      const foundProduct = products.find((p) => p._id === params.productId);
      if (foundProduct) {
        setProduct(foundProduct);
        loadProductReviews(foundProduct._id);
      }
    }
  }, [params.productId, products]);

  const loadProductReviews = async (productId: string) => {
    try {
      const productReviews = await fetchReviews(productId);
      if (productReviews) {
        setReviews(productReviews);
      }
    } catch {
      toast.error("Failed to load reviews");
    }
  };

  // Review management
  const onSubmitNewReview = async (data: ReviewFormData) => {
    if (!product || !user) {
      toast.error("You must be logged in to submit a review");
      return;
    }

    const reviewData: IReview = {
      product: product._id,
      rating: data.rating,
      comment: data.comment,
      name: `${user.firstName} ${user.lastName}`,
      user: user._id,
    };

    const hasReviewedProduct = product.reviews?.some(
      (review) => review.user === user._id
    );

    if (hasReviewedProduct) {
      toast.error("You have already reviewed this product.");
      return;
    }

    try {
      await handleCreateReview(reviewData);
      await loadProductReviews(product._id);
      newReviewForm.reset();
      toast.success("Review submitted successfully!");
    } catch {
      console.log("Failed to submit review");
    }
  };

  const onSubmitEditReview = async (data: ReviewFormData) => {
    if (!product || !user || !editingReview?._id) {
      toast.error("Unable to update review");
      return;
    }

    const updatedReviewData: IReview = {
      ...editingReview,
      rating: data.rating,
      comment: data.comment,
      user: user._id,
    };

    try {
      await handleUpdateReview(editingReview._id, updatedReviewData);
      await loadProductReviews(product._id);
      setIsEditDialogOpen(false);
      setEditingReview(null);
      editReviewForm.reset();
      toast.success("Review updated successfully!");
    } catch {
      toast.error("Failed to update review");
    }
  };

  const handleEditReview = (review: IReview) => {
    setEditingReview(review);
    editReviewForm.reset({
      rating: review.rating,
      comment: review.comment,
    });
    setIsEditDialogOpen(true);
  };

  const onDeleteReview = async (reviewId: string) => {
    try {
      await handleDeleteReview(reviewId);
      await loadProductReviews(product?._id || "");
      toast.success("Review deleted successfully!");
    } catch {
      toast.error("Failed to delete review");
    }
  };

  // Cart functions
  const getCartItemQuantity = (productId: string) => {
    const cartItem = cartItems.find((item) => item._id === productId);
    return cartItem?.quantity || 0;
  };

  const handleQuantityChange = (product: IProduct, change: number) => {
    const currentQuantity = getCartItemQuantity(product._id);
    const newQuantity = currentQuantity + change;

    if (newQuantity === 0) {
      dispatch(removeFromCart(product._id));
      toast.success("Removed from Cart");
    } else if (newQuantity <= product.countInStock) {
      dispatch(
        updateCartItemQuantity({ id: product._id, quantity: newQuantity })
      );
      toast.success("Cart Updated");
    }
  };

  const handleAddToCart = (product: IProduct) => {
    dispatch(addToCart(product));
    toast.success("Added to Cart");
  };

  // Wishlist functions
  const toggleWishlist = (product: IProduct) => {
    const isInWishlist = wishlistItems.some((item) => item._id === product._id);
    if (isInWishlist) {
      dispatch(removeFromWishlist(product._id));
      toast.success("Removed from Wishlist");
    } else {
      dispatch(addToWishlist(product));
      toast.success("Added to Wishlist");
    }
  };

  const isInWishlist = (productId: string) =>
    wishlistItems.some((item) => item._id === productId);

  if (productsLoading || reviewsLoading || userLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Loading...</div>
      </div>
    );
  }

  if (productsError || reviewsError || !product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-destructive">
          {productsError || reviewsError || "Product not found"}
        </div>
      </div>
    );
  }

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

        {/* Product Details */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <ProductImage
            product={product}
            isInWishlist={isInWishlist(product._id)}
            onWishlistToggle={() => toggleWishlist(product)}
          />

          <ProductInfo
            product={product}
            reviews={reviews}
            onAddToCart={() => handleAddToCart(product)}
            onQuantityChange={(change) => handleQuantityChange(product, change)}
            cartItemQuantity={getCartItemQuantity(product._id)}
          />
        </div>

        {/* Reviews Section */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold mb-8">Customer Reviews</h2>

          {/* New Review Form */}
          {user && (
            <Card className="mb-8">
              <CardContent className="pt-6">
                <ReviewForm
                  form={newReviewForm}
                  onSubmit={onSubmitNewReview}
                  submitLabel="Submit Review"
                />
              </CardContent>
            </Card>
          )}

          {/* Edit Review Dialog */}
          <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Edit Your Review</DialogTitle>
              </DialogHeader>
              <ReviewForm
                form={editReviewForm}
                onSubmit={onSubmitEditReview}
                submitLabel="Update Review"
                cancelButton={
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsEditDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                }
              />
            </DialogContent>
          </Dialog>

          {/* Reviews List */}

          <ReviewList
            reviews={reviews}
            currentUserId={user?._id}
            onEdit={handleEditReview}
            onDelete={onDeleteReview}
          />
        </div>
      </div>
    </section>
  );
}
