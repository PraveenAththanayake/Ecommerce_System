"use client";

import AboutSection from "@/components/About";
import CategorySection from "@/components/Category";
import FooterSection from "@/components/Footer";
import HeroSection from "@/components/Hero";
import NewsletterSection from "@/components/Newsletter";
import { FloatingActionButtons } from "@/components/FloatingActionButtons";

export default function Home() {
  return (
    <div className="relative min-h-screen">
      <HeroSection />
      <CategorySection />
      <AboutSection />
      <NewsletterSection />
      <FooterSection />
      <FloatingActionButtons />
    </div>
  );
}
