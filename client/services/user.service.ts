import axios from "axios";
import { IUser, IUserLogin, IEditUser } from "@/types";

// Base URL for your backend API
const API_URL = "http://localhost:8000/user";

// Create a new user
export const createUser = async (userData: IUser) => {
  try {
    const response = await axios.post(`${API_URL}/register`, userData, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data?.message || "Error creating user");
    } else {
      throw new Error("Error creating user");
    }
  }
};

// Fetch all users
export const getUsers = async () => {
  try {
    const response = await axios.get(`${API_URL}/get`, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data?.message || "Error fetching users");
    } else {
      throw new Error("Error fetching users");
    }
  }
};

// Fetch a single user by ID
export const getUserById = async (id: string) => {
  try {
    const response = await axios.get(`${API_URL}/get/${id}`, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data?.message || "Error fetching user");
    } else {
      throw new Error("Error fetching user");
    }
  }
};

// Login a user
export const loginUser = async (loginData: IUserLogin) => {
  try {
    const response = await axios.post(`${API_URL}/login`, loginData, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data?.message || "Error logging in");
    } else {
      throw new Error("Error logging in");
    }
  }
};

// Fetch the authenticated user's profile
export const getUserProfile = async () => {
  try {
    const response = await axios.get(`${API_URL}/profile`, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data?.message || "Error fetching profile");
    } else {
      throw new Error("Error fetching profile");
    }
  }
};

// Update the authenticated user's profile
export const updateUserProfile = async (updateData: IEditUser) => {
  try {
    const response = await axios.put(`${API_URL}/update-profile`, updateData, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data?.message || "Error updating profile");
    } else {
      throw new Error("Error updating profile");
    }
  }
};

// Delete the authenticated user's account
export const deleteUserAccount = async () => {
  try {
    const response = await axios.delete(`${API_URL}/delete`, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(
        error.response.data?.message || "Error deleting user account"
      );
    } else {
      throw new Error("Error deleting user account");
    }
  }
};
