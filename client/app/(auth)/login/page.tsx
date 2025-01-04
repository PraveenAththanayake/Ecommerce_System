"use client";

import React from "react";
import { Eye, Mail, Lock } from "lucide-react";
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

const Login = () => {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-secondary/10">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">
            Welcome back
          </CardTitle>
          <CardDescription className="text-center">
            Enter your credentials to access your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Input
                  id="email"
                  type="email"
                  placeholder="name@example.com"
                  className="pl-10"
                />
                <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input id="password" type="password" className="pl-10 pr-10" />
                <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                >
                  <Eye className="h-4 w-4 text-muted-foreground" />
                </Button>
              </div>
            </div>
            <Button className="w-full" type="submit">
              Sign in
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <div className="text-sm text-center text-muted-foreground">
            <a
              href="#"
              className="hover:text-primary underline underline-offset-4"
            >
              Forgot your password?
            </a>
          </div>
          <div className="text-sm text-center text-muted-foreground">
            Don&apos;t have an account?{" "}
            <a
              href="/register"
              className="text-primary hover:underline underline-offset-4"
            >
              Sign up
            </a>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Login;
