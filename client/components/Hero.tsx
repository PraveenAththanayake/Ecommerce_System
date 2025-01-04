"use client";

import React from "react";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

const HeroSection = () => {
  return (
    <div className="bg-background">
      <div className="h-[70px] lg:h-[160px]" />
      <div className="relative max-w-7xl mx-auto px-4 pb-12 lg:pb-20">
        {/* Background Pattern */}
        <div className="absolute inset-0 -z-10 opacity-5">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:24px_24px]" />
        </div>

        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          <div className="space-y-6 lg:space-y-8 pt-8 lg:pt-12">
            <div className="space-y-4 lg:space-y-6">
              <Badge variant="secondary" className="select-none">
                🌟 New Season Arrivals
              </Badge>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold tracking-tight">
                Discover Your Perfect
                <span className="text-primary block mt-1 lg:mt-2">
                  Style Statement
                </span>
              </h1>

              <p className="text-base sm:text-lg lg:text-xl text-muted-foreground max-w-[600px]">
                Explore our curated collection of premium fashion essentials.
                Quality meets style in every piece.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <Button size="lg" className="group">
                Shop Collection
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
              <Button size="lg" variant="outline">
                Learn More
              </Button>
            </div>

            <div className="grid grid-cols-3 gap-4 pt-4 lg:pt-6">
              {[
                { value: "50K+", label: "Happy Customers" },
                { value: "2K+", label: "Premium Products" },
                { value: "4.9", label: "Customer Rating" },
              ].map((stat, index) => (
                <div key={index} className="text-center sm:text-left">
                  <div className="text-xl sm:text-2xl font-bold">
                    {stat.value}
                  </div>
                  <div className="text-xs sm:text-sm text-muted-foreground">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="relative mt-8 lg:mt-0">
            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              {[1, 2, 3, 4].map((index) => (
                <Card key={index} className="group overflow-hidden">
                  <CardContent className="p-0">
                    <div className="relative aspect-[4/5] overflow-hidden">
                      <img
                        src={`/api/placeholder/400/${500 + index}`}
                        alt={`Featured product ${index}`}
                        className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                      <Button
                        size="icon"
                        variant="ghost"
                        className="absolute bottom-4 right-4 opacity-0 translate-y-2 transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0"
                      >
                        <ArrowUpRight className="h-5 w-5" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Floating Feature Cards */}
            <Card className="absolute -right-4 -top-4 lg:-right-8 lg:-top-8 w-36 lg:w-48 hidden md:block animate-float">
              <CardContent className="p-3 lg:p-4">
                <div className="flex items-center gap-2">
                  <Badge variant="secondary">New</Badge>
                  <span className="text-xs lg:text-sm font-medium">
                    Premium Collection
                  </span>
                </div>
              </CardContent>
            </Card>

            <Card className="absolute -left-4 -bottom-4 lg:-left-8 lg:-bottom-8 w-36 lg:w-48 hidden md:block animate-float-delayed">
              <CardContent className="p-3 lg:p-4">
                <div className="flex items-center gap-2">
                  <span className="text-xs lg:text-sm font-medium">
                    Free Shipping
                  </span>
                  <Badge variant="secondary">24h</Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Brands Ticker */}
        <div className="border-t mt-12 lg:mt-20">
          <div className="py-6 lg:py-8">
            <div className="flex items-center justify-between gap-4 lg:gap-8 opacity-50 overflow-x-auto">
              {["Brand 1", "Brand 2", "Brand 3", "Brand 4", "Brand 5"].map(
                (brand) => (
                  <div
                    key={brand}
                    className="text-lg lg:text-xl font-semibold whitespace-nowrap"
                  >
                    {brand}
                  </div>
                )
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
