import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import { Providers } from "@/providers/Providers";
import { UserProvider } from "@/context/UserContext";
import { Toaster } from "@/components/ui/sonner";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "E-Commerce System",
  description: "Modern e-commerce system",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${poppins.className}`}>
        <Providers>
          <UserProvider>{children}</UserProvider>
        </Providers>
        <Toaster />
      </body>
    </html>
  );
}
