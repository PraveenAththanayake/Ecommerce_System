"use client";

import CategorySection from "@/components/Category";
import HeroSection from "@/components/Hero";
import Navbar from "@/components/Navbar/Navbar";

export default function Home() {
  return (
    <div>
      <Navbar />

      <HeroSection />
      <CategorySection />
    </div>
  );
}
