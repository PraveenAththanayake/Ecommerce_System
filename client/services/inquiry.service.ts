import { IInquiry } from "@/types";
import axios from "axios";

const API_URL = "http://localhost:8000/inquiry";

export const createInquiry = async (inquiryData: IInquiry) => {
  try {
    const response = await axios.post(`${API_URL}/create`, inquiryData);
    return response.data;
  } catch {
    throw new Error("Error creating inquiry");
  }
};

export const getInquiries = async () => {
  try {
    const response = await axios.get(`${API_URL}/get`);
    return response.data;
  } catch {
    throw new Error("Error fetching inquiries");
  }
};

export const getInquiryById = async (id: string) => {
  try {
    const response = await axios.get(`${API_URL}/update/${id}`);
    return response.data;
  } catch {
    throw new Error("Error fetching inquiry");
  }
};

export const updateInquiry = async (id: string, inquiryData: IInquiry) => {
  try {
    const response = await axios.put(`${API_URL}/delete/${id}`, inquiryData);
    return response.data;
  } catch {
    throw new Error("Error updating inquiry");
  }
};

export const deleteInquiry = async (id: string) => {
  try {
    const response = await axios.delete(`${API_URL}/${id}`);
    return response.data;
  } catch {
    throw new Error("Error deleting inquiry");
  }
};
