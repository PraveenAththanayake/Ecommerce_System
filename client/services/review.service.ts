import { IReview } from "@/types";
import axios, { AxiosError } from "axios";

// Create Axios instance with default config for reviews
const reviewApi = axios.create({
  baseURL: "http://localhost:8000/review",
  withCredentials: true,
});

// Add request interceptor to add token to all requests
reviewApi.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Create Review
export const createReview = async (reviewData: IReview) => {
  try {
    const response = await reviewApi.post("/create", reviewData);
    return response.data;
  } catch (error) {
    handleAxiosError(error as AxiosError);
  }
};

// Get All Reviews for a Product
export const getReviews = async (productId: string) => {
  try {
    const response = await reviewApi.get(`/product/${productId}`);
    return response.data;
  } catch (error) {
    handleAxiosError(error as AxiosError);
  }
};

// Get Review by ID
export const getReviewById = async (id: string) => {
  try {
    const response = await reviewApi.get(`/${id}`);
    return response.data;
  } catch (error) {
    handleAxiosError(error as AxiosError);
  }
};

// Update Review
export const updateReview = async (id: string, reviewData: IReview) => {
  try {
    const response = await reviewApi.put(`/${id}`, reviewData);
    return response.data;
  } catch (error) {
    handleAxiosError(error as AxiosError);
  }
};

// Delete Review
export const deleteReview = async (id: string) => {
  try {
    const response = await reviewApi.delete(`/${id}`);
    return response.data;
  } catch (error) {
    handleAxiosError(error as AxiosError);
  }
};

// Get User's Reviews
export const getUserReviews = async () => {
  try {
    const response = await reviewApi.get("/user");
    return response.data;
  } catch (error) {
    handleAxiosError(error as AxiosError);
  }
};

// Helper function to handle Axios errors
const handleAxiosError = (error: AxiosError) => {
  if (axios.isAxiosError(error) && error.response) {
    const errorMessage =
      (error.response.data as { message: string }).message ||
      "An error occurred";
    throw new Error(errorMessage);
  } else {
    throw new Error("An error occurred");
  }
};
