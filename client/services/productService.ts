import { IProduct } from "@/types";
import axios from "axios";

// Base URL for your backend API
const API_URL = "http://localhost:8000/product";

// Create Product
export const createProduct = async (productData: IProduct) => {
  try {
    const response = await axios.post(`${API_URL}/create`, productData);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data?.message || "Error creating product");
    } else {
      throw new Error("Error creating product");
    }
  }
};

// Get All Products
export const getProducts = async () => {
  try {
    const response = await axios.get(`${API_URL}/get`);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(
        error.response.data?.message || "Error fetching products"
      );
    } else {
      throw new Error("Error fetching products");
    }
  }
};

// Get Product by ID
export const getProductById = async (id: string) => {
  try {
    const response = await axios.get(`${API_URL}/get/${id}`);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data?.message || "Error fetching product");
    } else {
      throw new Error("Error fetching product");
    }
  }
};

// Update Product
export const updateProduct = async (id: string, productData: IProduct) => {
  try {
    const response = await axios.put(`${API_URL}/update/${id}`, productData);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data?.message || "Error updating product");
    } else {
      throw new Error("Error updating product");
    }
  }
};

// Delete Product
export const deleteProduct = async (id: string) => {
  try {
    const response = await axios.delete(`${API_URL}/delete/${id}`);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(
        error.response?.data?.message || "Error deleting product"
      );
    } else {
      throw new Error("Error deleting product");
    }
  }
};
