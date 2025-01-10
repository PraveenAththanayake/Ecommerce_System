"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { setUser, logout } from "@/store/features/authSlice";
import { useGetProfileQuery } from "@/store/services/authApi";

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { token } = useSelector((state: RootState) => state.auth);

  const {
    data: profile,
    error,
    isLoading,
  } = useGetProfileQuery(undefined, {
    skip: !token,
    pollingInterval: 900000,
  });

  useEffect(() => {
    if (profile) {
      dispatch(setUser(profile));
    }

    if (error && "status" in error && error.status === 401) {
      dispatch(logout());
      router.push("/login");
    }
  }, [profile, error, dispatch, router]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return <>{children}</>;
};
