import axios from "axios";
import { ICategory } from "@/types";

const API_URL = "http://localhost:8000/category";

// Create Category
export const createCategory = async (categoryData: ICategory) => {
  try {
    const response = await axios.post(`${API_URL}/create`, categoryData);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(
        error.response.data?.message || "Error creating category"
      );
    } else {
      throw new Error("Error creating category");
    }
  }
};

// Get All Categories
export const getCategories = async () => {
  try {
    const response = await axios.get(`${API_URL}/get`);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(
        error.response.data?.message || "Error fetching categories"
      );
    } else {
      throw new Error("Error fetching categories");
    }
  }
};

// Get Category by ID
export const getCategoryById = async (id: string) => {
  try {
    const response = await axios.get(`${API_URL}/get/${id}`);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(
        error.response.data?.message || "Error fetching category"
      );
    } else {
      throw new Error("Error fetching category");
    }
  }
};

// Update Category
export const updateCategory = async (id: string, categoryData: ICategory) => {
  try {
    const response = await axios.put(`${API_URL}/update/${id}`, categoryData);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(
        error.response.data?.message || "Error updating category"
      );
    } else {
      throw new Error("Error updating category");
    }
  }
};

// Delete Category
export const deleteCategory = async (id: string) => {
  try {
    const response = await axios.delete(`${API_URL}/delete/${id}`);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(
        error.response.data?.message || "Error deleting category"
      );
    } else {
      throw new Error("Error deleting category");
    }
  }
};
