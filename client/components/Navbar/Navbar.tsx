"use client";

import React from "react";
import { Search, ShoppingCart, Menu, User, Heart, Bell } from "lucide-react";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { TopBar } from "../Topbar";
import { Logo } from "./Logo";

const menuItems = [
  {
    name: "Categories",
    href: "/categories",
    featured: ["Latest Drops", "Coming Soon", "Best Sellers"],
  },
  {
    name: "Trending",
    href: "/trending",
    featured: ["Most Popular", "Editor's Choice", "Top Rated"],
  },
  {
    name: "Deals",
    href: "/deals",
    featured: ["Daily Deals", "Clearance", "Bundle & Save"],
  },
  {
    name: "Collections",
    href: "/collections",
    featured: ["Summer 2024", "Essentials", "Limited Edition"],
  },
];

const useScroll = () => {
  const [isScrolled, setIsScrolled] = React.useState(false);

  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return isScrolled;
};

const DesktopNavigation = () => (
  <div className="hidden lg:block flex-1 ml-8 ">
    <NavigationMenu>
      <NavigationMenuList>
        {menuItems.map((item) => (
          <NavigationMenuItem key={item.name}>
            <NavigationMenuTrigger className="h-10">
              {item.name}
            </NavigationMenuTrigger>
            <NavigationMenuContent>
              <div className="w-[500px] p-6">
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-sm font-medium mb-4">Featured</h4>
                    <ul className="space-y-3">
                      {item.featured.map((featured) => (
                        <li key={featured}>
                          <NavigationMenuLink asChild>
                            <a href="#" className="text-sm hover:text-primary">
                              {featured}
                            </a>
                          </NavigationMenuLink>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="bg-primary/5 rounded-lg p-4">
                    <h4 className="text-sm font-medium mb-2">Special Offer</h4>
                    <p className="text-xs text-muted-foreground mb-3">
                      Get up to 50% off on selected items
                    </p>
                    <Button size="sm">Shop Now</Button>
                  </div>
                </div>
              </div>
            </NavigationMenuContent>
          </NavigationMenuItem>
        ))}
      </NavigationMenuList>
    </NavigationMenu>
  </div>
);

const SearchBar = () => (
  <div className="hidden lg:block flex-1 max-w-md mx-4">
    <div className="relative">
      <Input
        type="search"
        placeholder="Search for products..."
        className="w-full pl-10 pr-4 h-10 bg-secondary/30"
      />
      <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
    </div>
  </div>
);

const RightSideIcons = () => (
  <div className="flex items-center space-x-1 sm:space-x-2">
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="lg:hidden">
          <Search className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="top" className="w-full">
        <div className="pt-12 pb-4 px-4">
          <Input
            type="search"
            placeholder="Search for products..."
            className="w-full"
          />
        </div>
      </SheetContent>
    </Sheet>

    <Button variant="ghost" size="icon" className="hidden sm:flex relative">
      <Heart className="h-5 w-5" />
      <Badge className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center">
        2
      </Badge>
    </Button>

    <Button variant="ghost" size="icon" className="hidden sm:flex relative">
      <Bell className="h-5 w-5" />
      <Badge className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center">
        5
      </Badge>
    </Button>

    <Button variant="ghost" size="icon" className="relative">
      <ShoppingCart className="h-5 w-5" />
      <Badge className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center">
        3
      </Badge>
    </Button>

    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="hidden sm:flex">
          <Avatar className="h-8 w-8">
            <AvatarImage src="https://github.com/shadcn.png" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <div className="flex items-center justify-start gap-2 p-2">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium">John Doe</p>
            <p className="text-xs text-muted-foreground">john@example.com</p>
          </div>
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <User className="mr-2 h-4 w-4" /> Profile
        </DropdownMenuItem>
        <DropdownMenuItem>My Orders</DropdownMenuItem>
        <DropdownMenuItem>Saved Items</DropdownMenuItem>
        <DropdownMenuItem>Settings</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="text-red-600">Logout</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>

    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="lg:hidden">
          <Menu className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-80">
        <div className="h-full flex flex-col">
          <div className="flex-1 overflow-y-auto">
            <div className="space-y-4 py-4">
              <div className="flex items-center gap-4 px-4 py-2">
                <Avatar>
                  <AvatarImage src="https://github.com/shadcn.png" />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium">John Doe</p>
                  <p className="text-xs text-muted-foreground">
                    john@example.com
                  </p>
                </div>
              </div>

              <div className="space-y-1 px-3">
                {menuItems.map((item) => (
                  <Button
                    key={item.name}
                    variant="ghost"
                    className="w-full justify-start text-base"
                    asChild
                  >
                    <a href={item.href}>{item.name}</a>
                  </Button>
                ))}
              </div>

              <div className="px-3 py-2">
                <div className="text-xs font-medium text-muted-foreground mb-2">
                  Quick Links
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <Button variant="outline" size="sm" className="w-full">
                    Track Order
                  </Button>
                  <Button variant="outline" size="sm" className="w-full">
                    Help Center
                  </Button>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t px-3 py-4">
            <Button variant="destructive" className="w-full" size="sm">
              Logout
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  </div>
);

const Navbar = () => {
  const isScrolled = useScroll();

  return (
    <div
      className={`fixed w-full top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 
      ${isScrolled ? "border-b shadow-sm" : ""}`}
    >
      <TopBar />
      <nav className="border-b">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-16 lg:h-20">
            <Logo />
            <DesktopNavigation />
            <SearchBar />
            <RightSideIcons />
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
