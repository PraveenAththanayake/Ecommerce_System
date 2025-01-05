"use client";

import { useState } from "react";
import { Mail, ArrowRight, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const NewsletterSection = () => {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("idle");

  const handleSubmit = (e: { preventDefault: () => void }) => {
    e.preventDefault();
    setStatus("loading");
    setTimeout(() => {
      setStatus("success");
      setEmail("");
    }, 1000);
  };

  return (
    <section className="py-12 lg:py-10 bg-background relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden -z-10">
        <div className="absolute -left-4 top-1/4 w-24 h-24 bg-primary/10 rounded-full blur-2xl" />
        <div className="absolute -right-4 top-3/4 w-32 h-32 bg-primary/10 rounded-full blur-2xl" />
      </div>

      <div className="max-w-7xl mx-auto px-4">
        <Card className="relative overflow-hidden border bg-background/60 backdrop-blur-xl">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 p-6 sm:p-8 lg:p-12">
            <div className="space-y-6">
              <div className="space-y-4">
                <Badge variant="secondary" className="select-none">
                  📫 Stay Updated
                </Badge>

                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight">
                  Subscribe to Our
                  <span className="text-primary block mt-1">Newsletter</span>
                </h2>

                <p className="text-muted-foreground text-sm sm:text-base max-w-[600px]">
                  Join our community of fashion enthusiasts. Get exclusive
                  offers, early access to new collections, and style tips
                  delivered straight to your inbox.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-2">
                {[
                  "Exclusive Offers",
                  "New Arrivals",
                  "Style Tips",
                  "Special Events",
                ].map((benefit) => (
                  <Badge key={benefit} variant="outline" className="w-fit">
                    {benefit}
                  </Badge>
                ))}
              </div>

              <div className="pt-4">
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="flex flex-col sm:flex-row gap-2">
                    <div className="flex-1 relative">
                      <Input
                        type="email"
                        placeholder="Enter your email"
                        className="w-full pl-10"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    </div>
                    <Button
                      type="submit"
                      className="group"
                      disabled={status === "loading"}
                    >
                      {status === "loading" ? (
                        "Subscribing..."
                      ) : status === "success" ? (
                        <>
                          Subscribed
                          <CheckCircle2 className="ml-2 h-4 w-4" />
                        </>
                      ) : (
                        <>
                          Subscribe
                          <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                        </>
                      )}
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    By subscribing, you agree to our Privacy Policy and consent
                    to receive updates from our company.
                  </p>
                </form>
              </div>
            </div>

            <div className="relative hidden lg:block">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-primary/30 rounded-lg" />
              <div className="relative h-full">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="space-y-4 text-center">
                    <div className="flex items-center justify-center w-16 h-16 mx-auto rounded-full bg-background">
                      <Mail className="h-8 w-8" />
                    </div>
                    <div className="space-y-2">
                      <p className="text-xl font-semibold">
                        Join 50k+ Subscribers
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Who already get our weekly updates
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </section>
  );
};

export default NewsletterSection;
