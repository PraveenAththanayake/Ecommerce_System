"use client";

import AboutSection from "@/components/About";
import CategorySection from "@/components/Category";
import FooterSection from "@/components/Footer";
import HeroSection from "@/components/Hero";
import NewsletterSection from "@/components/Newsletter";

export default function Home() {
  return (
    <div>
      <HeroSection />
      <CategorySection />
      <AboutSection />
      <NewsletterSection />
      <FooterSection />
    </div>
  );
}
