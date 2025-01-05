import React from "react";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const categories = [
  {
    name: "New Arrivals",
    description: "Latest fashion trends and styles",
    itemCount: "2.5k",
    image: "/assets/products/product1.jpg",
    featured: true,
    tag: "Trending",
  },
  {
    name: "Clothing",
    description: "Premium everyday essentials",
    itemCount: "1.8k",
    image: "/assets/products/product2.jpg",
    tag: "Popular",
  },
  {
    name: "Accessories",
    description: "Complete your perfect look",
    itemCount: "950",
    image: "/assets/products/product3.jpg",
    tag: "New",
  },
  {
    name: "Footwear",
    description: "Step into comfort and style",
    itemCount: "1.2k",
    image: "/assets/products/product4.jpg",
    tag: "Best Seller",
  },
  {
    name: "Active Wear",
    description: "Performance meets fashion",
    itemCount: "780",
    image: "/assets/products/product1.jpg",
    tag: "Featured",
  },
  {
    name: "Collections",
    description: "Curated sets for every occasion",
    itemCount: "450",
    image: "/assets/products/product2.jpg",
    featured: true,
    tag: "Limited",
  },
];

const CategorySection = () => {
  return (
    <section className="py-12 lg:py-20 bg-background relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 -z-10 opacity-5">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:24px_24px]" />
      </div>

      <div className="max-w-7xl mx-auto px-4">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-8 lg:mb-12">
          <div className="space-y-2">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight">
              Shop by Category
            </h2>
            <p className="text-muted-foreground text-sm sm:text-base max-w-[600px]">
              Discover our wide range of categories, each carefully curated to
              help you find exactly what you&apos;re looking for.
            </p>
          </div>
          <Button
            variant="outline"
            size="default"
            className="mt-4 md:mt-0 group"
          >
            View All Categories
            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
          {categories.map((category, index) => (
            <Card
              key={index}
              className={`group overflow-hidden transition-all duration-300 hover:shadow-lg ${
                category.featured ? "sm:col-span-2 lg:col-span-1" : ""
              }`}
            >
              <CardContent className="p-0">
                <a href="#" className="block relative">
                  <div className="aspect-[4/5] relative overflow-hidden">
                    <Image
                      height={500}
                      width={400}
                      src={category.image}
                      alt={category.name}
                      className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

                    <div className="absolute inset-0 p-6 flex flex-col justify-between">
                      <Badge
                        variant="secondary"
                        className="w-fit backdrop-blur-sm bg-background/30"
                      >
                        {category.tag}
                      </Badge>

                      <div className="space-y-2">
                        <h3 className="text-xl sm:text-2xl font-semibold text-white">
                          {category.name}
                        </h3>
                        <p className="text-white/80 text-sm">
                          {category.description}
                        </p>
                        <div className="flex items-center justify-between pt-2">
                          <span className="text-white/90 text-sm">
                            {category.itemCount} items
                          </span>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="text-white hover:text-white hover:bg-white/20"
                          >
                            <ArrowRight className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </a>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategorySection;
