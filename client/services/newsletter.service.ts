// services/newsletter.service.ts
import axios, { AxiosError } from "axios";
import Cookies from "js-cookie";
import {
  INewsletter,
  INewsletterPreferences,
  INewsletterResponse,
} from "@/types";

const api = axios.create({
  baseURL: "http://localhost:8000/newsletter",
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
  (error: AxiosError) => {
    // Don't log errors for expected cases
    const isGetSubscriber = error.config?.url?.includes("/get/");
    const isSubscribe = error.config?.url?.includes("/subscribe");
    const is404 = error.response?.status === 404;
    const isAlreadySubscribed =
      error.response?.status === 400 &&
      (error.response?.data as { message: string })?.message?.includes(
        "already subscribed"
      );

    if (!(isGetSubscriber && is404) && !(isSubscribe && isAlreadySubscribed)) {
      console.error("Newsletter API Error:", error);
    }
    return Promise.reject(error);
  }
);

const handleAxiosError = (error: AxiosError) => {
  if (axios.isAxiosError(error)) {
    // Handle 404 for subscriber check silently
    if (
      error.response?.status === 404 &&
      error.config?.url?.includes("/get/")
    ) {
      return {
        success: false,
        message: "Subscriber not found",
        data: null,
      } as INewsletterResponse;
    }

    // Handle already subscribed case
    if (
      error.response?.status === 400 &&
      (error.response?.data as { message: string })?.message?.includes(
        "already subscribed"
      )
    ) {
      return {
        success: false,
        message: "Already subscribed",
        data: error.response.data,
        isExisting: true,
      } as INewsletterResponse;
    }

    if (error.response?.status === 400) {
      console.warn("Bad Request:", error.response.data);
      return {
        success: false,
        message:
          (error.response?.data as { message: string })?.message ||
          "Bad Request",
        data: null,
      } as INewsletterResponse;
    }

    const errorMessage =
      (error.response?.data as { message: string })?.message ||
      "An error occurred with the newsletter service";
    throw new Error(errorMessage);
  }
  throw new Error("An error occurred with the newsletter service");
};

const checkToken = () => {
  const token = Cookies.get("token");
  if (!token) {
    throw new Error("No token found, please login first.");
  }
  return token;
};

export const subscribe = async (
  email: string,
  preferences?: INewsletterPreferences
): Promise<INewsletterResponse> => {
  try {
    checkToken();
    const response = await api.post<INewsletterResponse>("/subscribe", {
      email,
      preferences,
    });
    return response.data;
  } catch (error) {
    throw handleAxiosError(error as AxiosError);
  }
};

export const unsubscribe = async (
  email: string
): Promise<INewsletterResponse> => {
  try {
    checkToken();
    const response = await api.post<INewsletterResponse>("/unsubscribe", {
      email,
    });
    return response.data;
  } catch (error) {
    throw handleAxiosError(error as AxiosError);
  }
};

export const getAllSubscribers = async (): Promise<INewsletterResponse> => {
  try {
    checkToken();
    const response = await api.get<INewsletterResponse>(`/get`);
    return response.data;
  } catch (error) {
    throw handleAxiosError(error as AxiosError);
  }
};

export const getSubscriberById = async (
  email: string
): Promise<INewsletterResponse> => {
  try {
    checkToken();
    const response = await api.get<INewsletterResponse>(`/get/${email}`);
    return response.data;
  } catch (error) {
    return handleAxiosError(error as AxiosError);
  }
};

export const updateSubscriber = async (
  email: string,
  data: Partial<Pick<INewsletter, "subscribed" | "subscriptionStatus">>
): Promise<INewsletterResponse> => {
  try {
    checkToken();
    const response = await api.put<INewsletterResponse>(
      `/update/${email}`,
      data
    );
    return response.data;
  } catch (error) {
    throw handleAxiosError(error as AxiosError);
  }
};

export const deleteSubscriber = async (
  id: string
): Promise<INewsletterResponse> => {
  try {
    checkToken();
    const response = await api.delete<INewsletterResponse>(`/delete/${id}`);
    return response.data;
  } catch (error) {
    throw handleAxiosError(error as AxiosError);
  }
};

export const bulkUpdateSubscribers = async (
  updates: Partial<INewsletter>[]
): Promise<INewsletterResponse> => {
  try {
    checkToken();
    const response = await api.put<INewsletterResponse>("/bulk-update", {
      updates,
    });
    return response.data;
  } catch (error) {
    throw handleAxiosError(error as AxiosError);
  }
};
