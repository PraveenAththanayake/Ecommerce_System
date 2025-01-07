import { IReview } from "@/types";
import axios, { AxiosError } from "axios";
import Cookies from "js-cookie";

const api = axios.create({
  baseURL: "http://localhost:8000/review",
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  const token = Cookies.get("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API Error:", error);
    return Promise.reject(error);
  }
);

export const createReview = async (reviewData: IReview) => {
  try {
    const response = await api.post("/create", reviewData);
    return response.data;
  } catch (error) {
    handleAxiosError(error as AxiosError);
  }
};

export const getReviews = async (productId: string) => {
  try {
    const response = await api.get(`/product/${productId}`);
    return response.data;
  } catch (error) {
    handleAxiosError(error as AxiosError);
  }
};

export const getReviewById = async (id: string) => {
  try {
    const response = await api.get(`/${id}`);
    return response.data;
  } catch (error) {
    handleAxiosError(error as AxiosError);
  }
};

export const updateReview = async (productId: string, reviewData: IReview) => {
  try {
    const token = Cookies.get("token");
    if (!token) {
      throw new Error("No token found, please login first.");
    }

    // Set token for the request
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    const response = await api.put(`/update/${productId}`, reviewData);
    return response.data;
  } catch (error) {
    handleAxiosError(error as AxiosError);
  }
};

export const deleteReview = async (id: string) => {
  try {
    const response = await api.delete(`/delete/${id}`);
    return response.data;
  } catch (error) {
    handleAxiosError(error as AxiosError);
  }
};

export const getUserReviews = async () => {
  try {
    const token = Cookies.get("token");
    if (!token) {
      throw new Error("No token found, please login first.");
    }

    // Set token for the request
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    const response = await api.get("/user");
    return response.data;
  } catch (error) {
    handleAxiosError(error as AxiosError);
  }
};

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
