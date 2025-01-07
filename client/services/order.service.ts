import { IOrder } from "@/types";
import axios, { AxiosError } from "axios";
import Cookies from "js-cookie";

const api = axios.create({
  baseURL: "http://localhost:8000/order",
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

export const createOrder = async (orderData: Omit<IOrder, "user">) => {
  try {
    const token = Cookies.get("token");
    if (!token) {
      throw new Error("No token found, please login first.");
    }

    const response = await api.post("/create", orderData);
    return response.data;
  } catch (error) {
    handleAxiosError(error as AxiosError);
  }
};

export const getAllOrders = async () => {
  try {
    const response = await api.get("/get");
    return response.data;
  } catch (error) {
    handleAxiosError(error as AxiosError);
  }
};

export const getOrder = async (orderId: string) => {
  try {
    const response = await api.get(`/get/${orderId}`);
    return response.data;
  } catch (error) {
    handleAxiosError(error as AxiosError);
  }
};

export const getUserOrders = async () => {
  try {
    const token = Cookies.get("token");
    if (!token) {
      throw new Error("No token found, please login first.");
    }

    const response = await api.get("/user/orders");
    return response.data;
  } catch (error) {
    handleAxiosError(error as AxiosError);
  }
};

export const updateOrder = async (
  orderId: string,
  updateData: Partial<IOrder>
) => {
  try {
    // Only allow updating shippingInfo and orderStatus
    const allowedUpdateData = {
      shippingInfo: updateData.shippingInfo,
      orderStatus: updateData.orderStatus,
    };

    const response = await api.put(`/update/${orderId}`, allowedUpdateData);
    return response.data;
  } catch (error) {
    handleAxiosError(error as AxiosError);
  }
};

export const updateOrderStatus = async (
  orderId: string,
  orderStatus: IOrder["orderStatus"]
) => {
  try {
    const response = await api.put(`/update/${orderId}/status`, {
      orderStatus,
    });
    return response.data;
  } catch (error) {
    handleAxiosError(error as AxiosError);
  }
};

export const deleteOrder = async (orderId: string) => {
  try {
    const response = await api.delete(`/update/${orderId}`);
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
