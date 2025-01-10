"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { getUserProfile } from "@/services";
import { useRouter } from "next/navigation";
import axios from "axios";

interface UserProfile {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  avatar?: string;
  address: string;
}

interface UserContextType {
  user: UserProfile | null;
  loading: boolean;
  error: string | null;
  refetchUser: () => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const fetchUserProfile = async () => {
    try {
      setLoading(true);
      const data = await getUserProfile();
      if (data) {
        setUser(data);
      }
    } catch (err) {
      // Instead of setting error state, handle unauthorized silently
      if (axios.isAxiosError(err) && err.response?.status === 401) {
        router.push("/login");
      }
      setUser(null);
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
        error: null,
        refetchUser: fetchUserProfile,
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
