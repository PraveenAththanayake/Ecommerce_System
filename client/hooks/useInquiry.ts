import { useState } from "react";
import { IInquiry } from "@/types";
import {
  getInquiries,
  getInquiryById,
  createInquiry,
  updateInquiry,
  deleteInquiry,
  getUserInquiry,
} from "@/services";

interface UseInquiryReturn {
  inquiries: IInquiry[];
  currentInquiry: IInquiry | null;
  loading: boolean;
  error: string | null;
  fetchInquiries: () => Promise<void>;
  fetchInquiryById: (id: string) => Promise<void>;
  createNewInquiry: (inquiryData: IInquiry) => Promise<void>;
  updateExistingInquiry: (id: string, inquiryData: IInquiry) => Promise<void>;
  deleteExistingInquiry: (id: string) => Promise<void>;
  fetchUserInquiry: () => Promise<IInquiry[]>;
}

export const useInquiry = (): UseInquiryReturn => {
  const [inquiries, setInquiries] = useState<IInquiry[]>([]);
  const [currentInquiry, setCurrentInquiry] = useState<IInquiry | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchInquiries = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getInquiries();
      setInquiries(data);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "An error occurred while fetching inquiries"
      );
    } finally {
      setLoading(false);
    }
  };

  const fetchInquiryById = async (id: string) => {
    try {
      setLoading(true);
      setError(null);
      const data = await getInquiryById(id);
      setCurrentInquiry(data);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "An error occurred while fetching the inquiry"
      );
    } finally {
      setLoading(false);
    }
  };

  const createNewInquiry = async (inquiryData: IInquiry) => {
    try {
      setLoading(true);
      setError(null);
      await createInquiry(inquiryData);
      await fetchInquiries();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "An error occurred while creating the inquiry"
      );
    } finally {
      setLoading(false);
    }
  };

  const updateExistingInquiry = async (id: string, inquiryData: IInquiry) => {
    try {
      setLoading(true);
      setError(null);
      await updateInquiry(id, inquiryData);
      await fetchInquiries(); // Refresh the list after update
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "An error occurred while updating the inquiry"
      );
    } finally {
      setLoading(false);
    }
  };

  const deleteExistingInquiry = async (id: string) => {
    try {
      setLoading(true);
      setError(null);
      await deleteInquiry(id);
      await fetchInquiries(); // Refresh the list after deletion
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "An error occurred while deleting the inquiry"
      );
    } finally {
      setLoading(false);
    }
  };
  const fetchUserInquiry = async () => {
    setLoading(true);
    setError(null);
    try {
      const userInquiry = await getUserInquiry();
      setInquiries(userInquiry);
      return userInquiry;
    } catch (err) {
      setError((err as Error).message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    inquiries,
    currentInquiry,
    loading,
    error,
    fetchInquiries,
    fetchInquiryById,
    createNewInquiry,
    updateExistingInquiry,
    deleteExistingInquiry,
    fetchUserInquiry,
  };
};
