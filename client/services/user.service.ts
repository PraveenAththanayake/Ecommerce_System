import { IUserLogin } from "@/types";
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
  (response) => {
    console.log("Response interceptor - Status:", response.status);
    console.log("Response interceptor - Data:", response.data);
    return response;
  },
  (error) => {
    console.error("Response interceptor - Error:", error);
    return Promise.reject(error);
  }
);

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
    throw error;
  }
};

// Updated getUserProfile to use stored token from cookie
export const getUserProfile = async () => {
  try {
    console.log("GetUserProfile - Making request");
    const token = Cookies.get("token");
    if (!token) {
      throw new Error("No token found, please login first.");
    }

    // Set token for the request
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;

    const response = await api.get("/profile");
    console.log("GetUserProfile - Response:", response.data);
    return response.data;
  } catch (error) {
    console.error("GetUserProfile - Error:", error);
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data?.message || "Error fetching profile");
    } else {
      throw new Error("Error fetching profile");
    }
  }
};

// Fixed logout function to remove cookie instead of localStorage
export const logoutUser = () => {
  console.log("LogoutUser - Removing token cookie");
  Cookies.remove("token", { path: "/" });
  const tokenAfterRemoval = Cookies.get("token");
  console.log("LogoutUser - Token after removal:", tokenAfterRemoval);
};
