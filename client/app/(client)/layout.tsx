import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import Navbar from "@/components/Navbar/Navbar";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "E-Commerce System",
  description: "Modern e-commerce system",
};

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div>
      <Navbar />
      {children}
    </div>
  );
}
