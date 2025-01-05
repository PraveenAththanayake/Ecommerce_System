"use client";

import React from "react";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";

const HeroSection = () => {
  const productImages = [
    "/assets/products/product1.jpg",
    "/assets/products/product2.jpg",
    "/assets/products/product3.jpg",
    "/assets/products/product4.jpg",
  ];

  return (
    <div className="bg-background">
      <div className="pt-[100px] lg:pt-[160px]" />
      <div className="relative max-w-7xl mx-auto px-4 pb-6 lg:pb-8">
        <div className="absolute inset-0 -z-10 opacity-5">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:24px_24px]" />
        </div>

        <div className="grid lg:grid-cols-2 gap-4 lg:gap-6 items-center justify-center">
          <div className="space-y-4 lg:space-y-6">
            <div className="space-y-3">
              <Badge variant="secondary" className="select-none">
                🌟 New Season Arrivals
              </Badge>

              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight">
                Discover Your Perfect
                <span className="text-primary block mt-1">Style Statement</span>
              </h1>

              <p className="text-sm sm:text-base text-muted-foreground max-w-[600px]">
                Explore our curated collection of premium fashion essentials.
                Quality meets style in every piece.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-2">
              <Button size="default" className="group">
                Shop Collection
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
              <Button size="default" variant="outline">
                Learn More
              </Button>
            </div>

            <div className="grid grid-cols-3 gap-3">
              {[
                { value: "50K+", label: "Happy Customers" },
                { value: "2K+", label: "Premium Products" },
                { value: "4.9", label: "Customer Rating" },
              ].map((stat, index) => (
                <div key={index} className="text-center sm:text-left">
                  <div className="text-lg font-bold">{stat.value}</div>
                  <div className="text-xs text-muted-foreground">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="grid grid-cols-2 gap-2">
              {productImages.map((src, index) => (
                <Card key={index} className="group overflow-hidden">
                  <CardContent className="p-0">
                    <div className="relative aspect-[4/3] overflow-hidden">
                      <Image
                        width={300}
                        height={400}
                        src={src}
                        alt={`Featured product ${index + 1}`}
                        className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                      <Button
                        size="sm"
                        variant="ghost"
                        className="absolute bottom-2 right-2 opacity-0 translate-y-2 transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0"
                      >
                        <ArrowUpRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Card className="absolute -right-2 -top-2 lg:-right-4 lg:-top-4 w-28 lg:w-32 hidden md:block animate-float">
              <CardContent className="p-2">
                <div className="flex items-center gap-1">
                  <Badge variant="secondary">New</Badge>
                  <span className="text-xs font-medium">Premium</span>
                </div>
              </CardContent>
            </Card>

            <Card className="absolute -left-2 -bottom-2 lg:-left-4 lg:-bottom-4 w-28 lg:w-32 hidden md:block animate-float-delayed">
              <CardContent className="p-2">
                <div className="flex items-center gap-1">
                  <span className="text-xs font-medium">Shipping</span>
                  <Badge variant="secondary">24h</Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
