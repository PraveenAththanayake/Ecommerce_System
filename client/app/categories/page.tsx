"use client";

import { ArrowRight, Package } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useRouter } from "next/navigation";
import { useProducts } from "@/hooks/useProduct";
import { useMemo } from "react";

const Category = () => {
  const { categories, products, loading, error } = useProducts();
  const router = useRouter();

  // Calculate product counts for each category using useMemo
  const productCounts = useMemo(() => {
    const counts: { [key: string]: number } = {};

    if (categories.length && products.length) {
      categories.forEach((category) => {
        counts[category.name] = products.filter(
          (product) =>
            product.category.toLowerCase() === category.name.toLowerCase()
        ).length;
      });
    }

    return counts;
  }, [categories, products]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-destructive">{error}</div>
      </div>
    );
  }

  return (
    <section className="mt-12 lg:mt-20 py-16 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <Badge variant="outline" className="mb-4">
            Explore Categories
          </Badge>
          <h2 className="text-3xl lg:text-4xl font-bold mb-4">
            Browse Our Collections
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Find exactly what you need from our carefully curated selection of
            products across multiple categories
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          {categories.map((category) => (
            <Card
              key={category._id}
              className="group bg-white hover:bg-slate-50 transition-all duration-300"
            >
              <CardContent className="p-4">
                <div className="mb-4 relative rounded-lg overflow-hidden">
                  <div className="aspect-square relative">
                    <Image
                      height={400}
                      width={400}
                      src={category.image}
                      alt={category.name}
                      className="object-cover rounded-lg group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold group-hover:text-primary transition-colors">
                      {category.name}
                    </h3>
                    <Badge variant="secondary" className="text-xs">
                      {category.slug}
                    </Badge>
                  </div>

                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {category.description}
                  </p>

                  <div className="pt-3 flex items-center justify-between border-t">
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Package className="h-4 w-4 mr-2" />
                      <span>{productCounts[category.name] || 0} products</span>
                    </div>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="group-hover:bg-primary group-hover:text-primary-foreground"
                      onClick={() =>
                        router.push(
                          `/categories/${category.name
                            .toLowerCase()
                            .replace(/\s+/g, "-")}`
                        )
                      }
                    >
                      View Products
                      <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Category;
