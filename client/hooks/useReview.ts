import { useState, useCallback } from "react";
import { IReview } from "@/types";
import {
  createReview,
  deleteReview,
  getReviewById,
  getReviews,
  getUserReviews,
  updateReview,
} from "@/services";
import { toast } from "sonner";

export const useReview = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [reviews, setReviews] = useState<IReview[] | null>(null);
  const [review, setReview] = useState<IReview | null>(null);

  const handleCreateReview = async (reviewData: IReview) => {
    try {
      setLoading(true);
      setError(null);
      const response = await createReview(reviewData);
      return response.review;
    } catch (err) {
      if (err instanceof Error) {
        if (err.message === "You have already reviewed this product") {
          toast.error("You have already reviewed this product.");
        } else {
          setError(err.message);
        }
      } else {
        setError("Failed to create review");
      }
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const fetchReviews = async (productId: string) => {
    try {
      setLoading(true);
      setError(null);
      const response = await getReviews(productId);
      setReviews(response.reviews);
      return response.reviews;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch reviews");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const fetchReviewById = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      const fetchedReview = await getReviewById(id);
      setReview(fetchedReview);
      return fetchedReview;
    } catch (err) {
      setError((err as Error).message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const handleUpdateReview = useCallback(
    async (productId: string, reviewData: IReview) => {
      setLoading(true);
      setError(null);
      try {
        const updatedReview = await updateReview(productId, reviewData);
        setReviews((prev) =>
          prev
            ? prev.map((r) => (r.id === productId ? updatedReview : r))
            : [updatedReview]
        );
        setReview(updatedReview);
        return updatedReview;
      } catch (err) {
        setError((err as Error).message);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const handleDeleteReview = useCallback(
    async (id: string) => {
      setLoading(true);
      setError(null);
      try {
        await deleteReview(id);
        setReviews((prev) => (prev ? prev.filter((r) => r.id !== id) : null));
        if (review?.id === id) setReview(null);
      } catch (err) {
        setError((err as Error).message);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [review]
  );

  const fetchUserReviews = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const userReviews = await getUserReviews();
      setReviews(userReviews);
      return userReviews;
    } catch (err) {
      setError((err as Error).message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    error,
    reviews,
    review,
    handleCreateReview,
    fetchReviews,
    fetchReviewById,
    handleUpdateReview,
    handleDeleteReview,
    fetchUserReviews,
  };
};
