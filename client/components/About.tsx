import React from "react";
import { Circle, Package, Shield, Truck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";

const features = [
  {
    icon: <Package className="h-6 w-6" />,
    title: "Premium Quality",
    description:
      "Every product in our collection is carefully selected to ensure the highest quality standards.",
  },
  {
    icon: <Shield className="h-6 w-6" />,
    title: "Secure Shopping",
    description:
      "Shop with confidence knowing your data is protected with state-of-the-art security.",
  },
  {
    icon: <Truck className="h-6 w-6" />,
    title: "Fast Delivery",
    description:
      "Enjoy quick and reliable shipping to your doorstep with our efficient delivery network.",
  },
];

const stats = [
  { value: "8+", label: "Years of Excellence" },
  { value: "2M+", label: "Happy Customers" },
  { value: "150+", label: "Retail Locations" },
  { value: "95%", label: "Customer Satisfaction" },
];

const AboutSection = () => {
  return (
    <section className="py-12 lg:py-20 bg-background/50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          <div className="relative">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <div className="aspect-[4/5] relative rounded-lg overflow-hidden">
                  <Image
                    width={400}
                    height={500}
                    src="/assets/products/product1.jpg"
                    alt="About EStore 1"
                    className="object-cover w-full h-full"
                  />
                </div>
                <div className="aspect-[4/3] relative rounded-lg overflow-hidden">
                  <Image
                    width={400}
                    height={500}
                    src="/assets/products/product1.jpg"
                    alt="About EStore 2"
                    className="object-cover w-full h-full"
                  />
                </div>
              </div>
              <div className="mt-8 space-y-4">
                <div className="aspect-[4/3] relative rounded-lg overflow-hidden">
                  <Image
                    width={400}
                    height={500}
                    src="/assets/products/product1.jpg"
                    alt="About EStore 3"
                    className="object-cover w-full h-full"
                  />
                </div>
                <div className="aspect-[4/5] relative rounded-lg overflow-hidden">
                  <Image
                    width={400}
                    height={500}
                    src="/assets/products/product1.jpg"
                    alt="About EStore 4"
                    className="object-cover w-full h-full"
                  />
                </div>
              </div>
            </div>
            <Circle className="absolute -left-4 -top-4 text-primary h-8 w-8 opacity-20" />
            <Circle className="absolute -right-4 -bottom-4 text-primary h-8 w-8 opacity-20" />
          </div>
          <div className="lg:pl-8 space-y-8">
            <div className="space-y-4">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight">
                Crafting Excellence in
                <span className="text-primary block mt-1">Fashion & Style</span>
              </h2>
              <p className="text-muted-foreground">
                Since 2015, EStore has been at the forefront of fashion retail,
                combining premium quality with accessible style. Our journey
                began with a simple vision: to make exceptional fashion
                available to everyone.
              </p>
              <p className="text-muted-foreground">
                Today, we&apos;re proud to serve millions of customers
                worldwide, offering carefully curated collections that blend
                timeless elegance with contemporary trends.
              </p>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-8 border-y">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-2xl font-bold">{stat.value}</div>
                  <div className="text-sm text-muted-foreground mt-1">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
            <div className="grid sm:grid-cols-3 gap-4">
              {features.map((feature, index) => (
                <Card key={index} className="bg-primary/5 border-none">
                  <CardContent className="p-4 text-center space-y-2">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                      {feature.icon}
                    </div>
                    <h3 className="font-semibold">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <Button size="lg">Learn More</Button>
              <Button size="lg" variant="outline">
                Contact Us
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
