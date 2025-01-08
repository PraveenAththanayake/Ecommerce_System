import { IInquiry } from "@/types";
import axios from "axios";
import Cookies from "js-cookie";

const api = axios.create({
  baseURL: "http://localhost:8000/inquiry",
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

export const createInquiry = async (inquiryData: Omit<IInquiry, "user">) => {
  try {
    const token = Cookies.get("token");
    if (!token) {
      throw new Error("No token found, please login first.");
    }
    const response = await api.post("/create", inquiryData);
    return response.data;
  } catch (error) {
    console.error("Create Inquiry Error:", error);
    throw error;
  }
};

export const getInquiries = async () => {
  try {
    const response = await api.get("/get");
    return response.data;
  } catch (error) {
    console.error("Get Inquiries Error:", error);
    throw error;
  }
};

export const getInquiryById = async (id: string) => {
  try {
    const response = await api.get(`/get/${id}`);
    return response.data;
  } catch (error) {
    console.error("Get Inquiry Error:", error);
    throw error;
  }
};

export const updateInquiry = async (
  id: string,
  inquiryData: Partial<IInquiry>
) => {
  try {
    const response = await api.put(`/update/${id}`, inquiryData);
    return response.data;
  } catch (error) {
    console.error("Update Inquiry Error:", error);
    throw error;
  }
};

export const deleteInquiry = async (id: string) => {
  try {
    const response = await api.delete(`/delete/${id}`);
    return response.data;
  } catch (error) {
    console.error("Delete Inquiry Error:", error);
    throw error;
  }
};

export const getUserInquiry = async () => {
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
    console.error("Get Inquiry Error:", error);
    throw error;
  }
};
