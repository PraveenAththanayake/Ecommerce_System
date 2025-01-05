import React from "react";
import {
  Facebook,
  Instagram,
  Twitter,
  Youtube,
  MapPin,
  Phone,
  Mail,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Logo } from "./Navbar/Logo";

const FooterSection = () => {
  const footerLinks = {
    shop: [
      { label: "New Arrivals", href: "/new-arrivals" },
      { label: "Best Sellers", href: "/best-sellers" },
      { label: "Women's Collection", href: "/womens" },
      { label: "Men's Collection", href: "/mens" },
      { label: "Sale", href: "/sale" },
    ],
    company: [
      { label: "About Us", href: "/about" },
      { label: "Careers", href: "/careers" },
      { label: "Store Locations", href: "/stores" },
      { label: "Our Blog", href: "/blog" },
      { label: "Reviews", href: "/reviews" },
    ],
    support: [
      { label: "Contact Us", href: "/contact" },
      { label: "FAQs", href: "/faqs" },
      { label: "Shipping Info", href: "/shipping" },
      { label: "Returns Policy", href: "/returns" },
      { label: "Size Guide", href: "/size-guide" },
    ],
  };

  const socialLinks = [
    { icon: <Facebook className="h-5 w-5" />, href: "#", label: "Facebook" },
    { icon: <Instagram className="h-5 w-5" />, href: "#", label: "Instagram" },
    { icon: <Twitter className="h-5 w-5" />, href: "#", label: "Twitter" },
    { icon: <Youtube className="h-5 w-5" />, href: "#", label: "Youtube" },
  ];

  return (
    <footer className="bg-background border-t mt-10">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 py-12">
          {/* Company Info */}
          <div className="lg:col-span-2 space-y-4">
            <Logo />
            <p className="text-muted-foreground">
              Your premier destination for fashion and style since 2015. We
              bring you the latest trends with uncompromising quality and
              exceptional service.
            </p>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-muted-foreground">
                <MapPin className="h-4 w-4" />
                <span>123 Fashion Street, Style City, ST 12345</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Phone className="h-4 w-4" />
                <span>+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Mail className="h-4 w-4" />
                <span>contact@estore.com</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category} className="space-y-4">
              <h3 className="font-semibold uppercase">{category}</h3>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-muted-foreground hover:text-primary transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Section */}
        <div className="border-t py-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex gap-4">
              {socialLinks.map((social) => (
                <Button key={social.label} variant="ghost" size="icon" asChild>
                  <Link href={social.href} aria-label={social.label}>
                    {social.icon}
                  </Link>
                </Button>
              ))}
            </div>
            <div className="flex flex-wrap justify-center gap-4 text-sm text-muted-foreground">
              <Link href="/privacy" className="hover:text-primary">
                Privacy Policy
              </Link>
              <Link href="/terms" className="hover:text-primary">
                Terms of Service
              </Link>
              <Link href="/accessibility" className="hover:text-primary">
                Accessibility
              </Link>
              <span>© 2025 E Store. All rights reserved.</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default FooterSection;
