import { IOrder } from "@/types";
import axios from "axios";

// Base URL for your backend API
const API_URL = "http://localhost:8000/order";

// Create a new order
export const createOrder = async (orderData: IOrder) => {
  try {
    const response = await axios.post(`${API_URL}/create`, orderData, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data?.message || "Error creating order");
    } else {
      throw new Error("Error creating order");
    }
  }
};

// Fetch all orders
export const getOrders = async () => {
  try {
    const response = await axios.get(`${API_URL}/get`, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data?.message || "Error fetching orders");
    } else {
      throw new Error("Error fetching orders");
    }
  }
};

// Fetch a single order by ID
export const getOrderById = async (id: string) => {
  try {
    const response = await axios.get(`${API_URL}/get/${id}`, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data?.message || "Error fetching order");
    } else {
      throw new Error("Error fetching order");
    }
  }
};

// Fetch orders for the authenticated user
export const getUserOrders = async () => {
  try {
    const response = await axios.get(`${API_URL}/user/orders`, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(
        error.response.data?.message || "Error fetching user orders"
      );
    } else {
      throw new Error("Error fetching user orders");
    }
  }
};

// Update an order
export const updateOrder = async (id: string, updateData: Partial<IOrder>) => {
  try {
    const response = await axios.put(`${API_URL}/update/${id}`, updateData, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data?.message || "Error updating order");
    } else {
      throw new Error("Error updating order");
    }
  }
};

// Update order status
export const updateOrderStatus = async (id: string, orderStatus: string) => {
  try {
    const response = await axios.put(
      `${API_URL}/update-status/${id}`,
      { orderStatus },
      { withCredentials: true }
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(
        error.response.data?.message || "Error updating order status"
      );
    } else {
      throw new Error("Error updating order status");
    }
  }
};

// Delete an order
export const deleteOrder = async (id: string) => {
  try {
    const response = await axios.delete(`${API_URL}/delete/${id}`, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data?.message || "Error deleting order");
    } else {
      throw new Error("Error deleting order");
    }
  }
};
