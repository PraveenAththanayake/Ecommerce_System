"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import {
  getUserProfile,
  updateUserProfile,
  deleteUserAccount,
} from "@/services";
import { useRouter } from "next/navigation";
import axios from "axios";
import { UpdateUserData, UserContextType, UserProfile } from "@/types";

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const fetchUserProfile = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getUserProfile();
      setUser(data);
    } catch (err) {
      if (axios.isAxiosError(err) && err.response?.status === 401) {
        setUser(null);
        router.push("/login");
      }
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProfile = async (data: UpdateUserData) => {
    try {
      setLoading(true);
      setError(null);
      const updatedUser = await updateUserProfile(data);
      setUser(updatedUser);
      return updatedUser;
    } catch (err) {
      if (axios.isAxiosError(err)) {
        const errorMessage =
          err.response?.data?.message || "Failed to update profile";
        setError(errorMessage);
        throw new Error(errorMessage);
      }
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    try {
      setLoading(true);
      setError(null);
      await deleteUserAccount();
      setUser(null);
      // Use setTimeout to ensure state updates complete before navigation
      setTimeout(() => {
        router.push("/login");
      }, 0);
    } catch (err) {
      if (axios.isAxiosError(err)) {
        const errorMessage =
          err.response?.data?.message || "Failed to delete account";
        setError(errorMessage);
        throw new Error(errorMessage);
      }
      throw err;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserProfile();
  }, []);

  return (
    <UserContext.Provider
      value={{
        user,
        loading,
        error,
        refetchUser: fetchUserProfile,
        updateProfile: handleUpdateProfile,
        deleteAccount: handleDeleteAccount,
        setError,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};
