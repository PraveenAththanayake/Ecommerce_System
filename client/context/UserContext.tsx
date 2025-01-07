"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { getUserProfile } from "@/services";

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
  const [error, setError] = useState<string | null>(null);

  const fetchUserProfile = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getUserProfile();
      setUser(data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to fetch user profile"
      );
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
        error,
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
