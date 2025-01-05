"use client";

import AboutSection from "@/components/About";
import CategorySection from "@/components/Category";
import FooterSection from "@/components/Footer";
import HeroSection from "@/components/Hero";
import Navbar from "@/components/Navbar/Navbar";
import NewsletterSection from "@/components/Newsletter";

export default function Home() {
  return (
    <div>
      <Navbar />
      <HeroSection />
      <CategorySection />
      <AboutSection />
      <NewsletterSection />
      <FooterSection />
    </div>
  );
}
