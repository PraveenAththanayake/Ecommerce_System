import { IUserLogin } from "@/types";
import axios from "axios";

// Create axios instance with default config
const api = axios.create({
  baseURL: "http://localhost:8000/user",
  withCredentials: true,
});

// Add request interceptor to add token to all requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Updated login function to save token
export const loginUser = async (loginData: IUserLogin) => {
  try {
    const response = await api.post("/login", loginData);
    // Save token to localStorage
    if (response.data.token) {
      localStorage.setItem("token", response.data.token);
    }
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data?.message || "Error logging in");
    } else {
      throw new Error("Error logging in");
    }
  }
};

// Updated getUserProfile to use stored token
export const getUserProfile = async () => {
  try {
    const response = await api.get("/profile");
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data?.message || "Error fetching profile");
    } else {
      throw new Error("Error fetching profile");
    }
  }
};

// Add logout function
export const logoutUser = () => {
  localStorage.removeItem("token");
};
