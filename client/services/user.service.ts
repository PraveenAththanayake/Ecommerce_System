import { IUser, IUserLogin } from "@/types";
import axios from "axios";
import Cookies from "js-cookie";

// Create axios instance with default config
const api = axios.create({
  baseURL: "http://localhost:8000/user",
  withCredentials: true,
});

// Add request interceptor to add token to all requests
api.interceptors.request.use((config) => {
  // Get token from cookie
  const token = Cookies.get("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
    console.log("Request interceptor - Token found:", token);
  }

  return config;
});

// Add response interceptor for debugging
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      Cookies.remove("token", { path: "/" });
      window.location.href = "/login";
      return new Promise(() => {});
    }
    return Promise.reject(error);
  }
);

// Create user
export const createUser = async (userData: IUser) => {
  try {
    const response = await api.post("/register", userData);
    return response.data;
  } catch (error) {
    console.error("CreateUser - Error:", error);
    throw error;
  }
};

// Updated login function to save token
export const loginUser = async (loginData: IUserLogin) => {
  try {
    const response = await api.post("/login", loginData);

    if (response.data.token) {
      // Set token in cookie
      Cookies.set("token", response.data.token, {
        path: "/",
        maxAge: 86400,
        sameSite: "lax",
      });

      // Set default authorization header
      api.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${response.data.token}`;
    }

    return response.data;
  } catch (error) {
    console.error("LoginUser - Error:", error);
  }
};

// Get user profile
export const getUserProfile = async () => {
  try {
    const token = Cookies.get("token");
    if (!token) {
      return null;
    }

    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    const response = await api.get("/profile");
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      Cookies.remove("token", { path: "/" });
    }
    return null;
  }
};

// Update user profile
export const updateUserProfile = async (userData: Partial<IUser>) => {
  try {
    const token = Cookies.get("token");
    if (!token) {
      throw new Error("No authentication token found");
    }

    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    const response = await api.put("/update", userData);
    return response.data;
  } catch (error) {
    console.error("UpdateUserProfile - Error:", error);
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      Cookies.remove("token", { path: "/" });
      window.location.href = "/login";
    }
    throw error;
  }
};

// Delete user account
export const deleteUserAccount = async () => {
  try {
    const token = Cookies.get("token");
    if (!token) {
      throw new Error("No authentication token found");
    }

    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    const response = await api.delete("/delete");

    Cookies.remove("token", { path: "/" });
    return response.data;
  } catch (error) {
    console.error("DeleteUserAccount - Error:", error);
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      Cookies.remove("token", { path: "/" });
      window.location.href = "/login";
    }
    throw error;
  }
};

// Logout user
export const logoutUser = () => {
  console.log("LogoutUser - Removing token cookie");
  Cookies.remove("token", { path: "/" });
  const tokenAfterRemoval = Cookies.get("token");
  console.log("LogoutUser - Token after removal:", tokenAfterRemoval);
};
