"use client";

import React, { useState } from "react";
import { Eye, EyeOff, Mail, Lock } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useRouter } from "next/navigation";
import { useLoginMutation } from "@/store/services/authApi";
import { useDispatch } from "react-redux";
import { setCredentials } from "@/store/features/authSlice";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [login, { isLoading, error }] = useLoginMutation();
  const dispatch = useDispatch();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const userData = await login({ email, password }).unwrap();
      console.log("Login response:", userData);

      if (userData.token) {
        // Store token in cookie
        document.cookie = `token=${userData.token}; path=/; max-age=86400; samesite=lax`;
        document.cookie = `role=${userData.role}; path=/; max-age=86400; samesite=lax`;
        console.log("Cookies set:", document.cookie);

        // Store in Redux
        dispatch(
          setCredentials({
            user: userData,
            token: userData.token,
            role: userData.role,
          })
        );
        if (userData.role === "admin") {
          router.push("/admin");
        } else {
          router.push("/");
        }
      }
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      // Handle error silently
    }
  };

  const handlePasswordToggle = () => setShowPassword(!showPassword);

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-b from-secondary/10 to-background">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <div className="flex justify-center mb-2">
            <div className="p-3 rounded-full bg-primary/10">
              <Lock className="h-6 w-6 text-primary" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold text-center">
            Welcome back
          </CardTitle>
          <CardDescription className="text-center">
            Enter your credentials to access your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Input
                  id="email"
                  type="email"
                  placeholder="name@example.com"
                  className="pl-10"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isLoading}
                  required
                />
                <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  className="pl-10"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isLoading}
                  required
                />
                <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={handlePasswordToggle}
                  disabled={isLoading}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <Eye className="h-4 w-4 text-muted-foreground" />
                  )}
                </Button>
              </div>
            </div>
            {error && (
              <Alert variant="destructive">
                <AlertDescription>
                  {"data" in error &&
                  typeof error.data === "object" &&
                  error.data !== null &&
                  "message" in error.data
                    ? (error.data as { message: string }).message
                    : "Invalid credentials"}
                </AlertDescription>
              </Alert>
            )}
            <Button className="w-full" type="submit" disabled={isLoading}>
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                  <span>Signing in...</span>
                </div>
              ) : (
                "Sign in"
              )}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <div className="text-sm text-center text-muted-foreground">
            <Button
              variant="link"
              className="hover:text-primary"
              onClick={() => router.push("/forgot-password")}
            >
              Forgot your password?
            </Button>
          </div>
          <div className="text-sm text-center text-muted-foreground">
            Don&apos;t have an account?{" "}
            <Button
              variant="link"
              className="text-primary p-0"
              onClick={() => router.push("/register")}
            >
              Sign up
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Login;
