"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Plus, Filter, Search } from "lucide-react";
import {
  createProduct,
  deleteProduct,
  getProducts,
  updateProduct,
} from "@/services";
import { getCategories } from "@/services";
import { ICategory, IProduct } from "@/types";
import { ProductCard } from "@/components/admin/product/ProductCard";
import { ProductForm } from "@/components/admin/product/ProductForm";

interface FilterState {
  category: string;
  search: string;
  priceRange: {
    min: string;
    max: string;
  };
  stockStatus: string;
}

const AdminProductPage = () => {
  const [products, setProducts] = useState<IProduct[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<IProduct[]>([]);
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [filters, setFilters] = useState<FilterState>({
    category: "all",
    search: "",
    priceRange: { min: "", max: "" },
    stockStatus: "all",
  });

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    image: "",
    category: "",
    stock: "",
  });

  useEffect(() => {
    const initialize = async () => {
      await Promise.all([fetchProducts(), fetchCategories()]);
    };
    initialize();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [filters, products]);

  const applyFilters = () => {
    let filtered = [...products];

    // Category filter
    if (filters.category && filters.category !== "all") {
      filtered = filtered.filter(
        (product) => product.category === filters.category
      );
    }

    // Search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(
        (product) =>
          product.name.toLowerCase().includes(searchLower) ||
          product.description.toLowerCase().includes(searchLower)
      );
    }

    // Price range filter
    if (filters.priceRange.min) {
      filtered = filtered.filter(
        (product) => product.price >= parseFloat(filters.priceRange.min)
      );
    }
    if (filters.priceRange.max) {
      filtered = filtered.filter(
        (product) => product.price <= parseFloat(filters.priceRange.max)
      );
    }

    // Stock status filter
    switch (filters.stockStatus) {
      case "inStock":
        filtered = filtered.filter((product) => product.countInStock > 0);
        break;
      case "outOfStock":
        filtered = filtered.filter((product) => product.countInStock === 0);
        break;
      case "lowStock":
        filtered = filtered.filter(
          (product) => product.countInStock > 0 && product.countInStock <= 10
        );
        break;
      case "all":
      default:
        break;
    }

    setFilteredProducts(filtered);
  };

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getProducts();
      if (Array.isArray(data)) {
        setProducts(data);
        setFilteredProducts(data);
      } else {
        setProducts([]);
        setFilteredProducts([]);
        setError("Invalid products data received");
      }
    } catch {
      setError("Failed to fetch products. Please try again later.");
      setProducts([]);
      setFilteredProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const data = await getCategories();
      if (Array.isArray(data)) {
        setCategories(data);
      } else {
        setCategories([]);
        setError("Invalid categories data received");
      }
    } catch {
      setError("Failed to fetch categories. Please try again later.");
      setCategories([]);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCategoryChange = (value: string) => {
    setFormData((prev) => ({ ...prev, category: value }));
  };

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      price: "",
      image: "",
      category: "",
      stock: "",
    });
    setEditingProductId(null);
    setShowDialog(false);
  };

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);
      setError(null);

      if (!formData.name || !formData.price || !formData.category) {
        throw new Error("Please fill in all required fields");
      }

      const productData: IProduct = {
        _id: editingProductId || "",
        name: formData.name,
        description: formData.description,
        price: parseFloat(formData.price) || 0,
        countInStock: parseInt(formData.stock) || 0,
        imageUrl: formData.image,
        category: formData.category,
        slug: formData.name.toLowerCase().replace(/ /g, "-"),
        numReviews: 0,
        rating: 0,
      };

      if (editingProductId) {
        await updateProduct(editingProductId, productData);
      } else {
        await createProduct(productData);
      }

      resetForm();
      await fetchProducts();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : `Failed to ${
              editingProductId ? "update" : "create"
            } product. Please try again.`
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (product: IProduct) => {
    setEditingProductId(product._id);
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price.toString(),
      image: product.imageUrl,
      category: product.category,
      stock: product.countInStock.toString(),
    });
    setShowDialog(true);
  };

  const handleDelete = async (id: string) => {
    try {
      setError(null);
      await deleteProduct(id);
      await fetchProducts();
    } catch {
      setError("Failed to delete product. Please try again.");
    }
  };

  const renderSkeletons = () => {
    return Array.from({ length: 6 }).map((_, index) => (
      <Card key={`skeleton-${index}`} className="overflow-hidden">
        <CardContent className="p-0">
          <Skeleton className="h-48 rounded-t-lg" />
          <div className="p-4 space-y-3">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-1/2" />
          </div>
        </CardContent>
      </Card>
    ));
  };

  const FilterPanel = () => (
    <div className="bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 p-4 rounded-lg shadow-sm border mb-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Search</label>
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search products..."
              className="pl-8"
              value={filters.search}
              onChange={(e) =>
                setFilters((prev) => ({ ...prev, search: e.target.value }))
              }
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Category</label>
          <Select
            value={filters.category}
            onValueChange={(value) =>
              setFilters((prev) => ({ ...prev, category: value }))
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category._id} value={category.name}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Price Range</label>
          <div className="flex gap-2">
            <Input
              type="number"
              placeholder="Min"
              value={filters.priceRange.min}
              onChange={(e) =>
                setFilters((prev) => ({
                  ...prev,
                  priceRange: { ...prev.priceRange, min: e.target.value },
                }))
              }
            />
            <Input
              type="number"
              placeholder="Max"
              value={filters.priceRange.max}
              onChange={(e) =>
                setFilters((prev) => ({
                  ...prev,
                  priceRange: { ...prev.priceRange, max: e.target.value },
                }))
              }
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Stock Status</label>
          <Select
            value={filters.stockStatus}
            onValueChange={(value) =>
              setFilters((prev) => ({ ...prev, stockStatus: value }))
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="All Stock Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="inStock">In Stock</SelectItem>
              <SelectItem value="outOfStock">Out of Stock</SelectItem>
              <SelectItem value="lowStock">Low Stock (≤10)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex justify-end mt-4">
        <Button
          variant="outline"
          onClick={() =>
            setFilters({
              category: "all",
              search: "",
              priceRange: { min: "", max: "" },
              stockStatus: "all",
            })
          }
        >
          Reset Filters
        </Button>
      </div>
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="flex justify-between items-center mb-8">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight">Products</h1>
          <p className="text-sm text-muted-foreground">
            Showing {filteredProducts.length} of {products.length} products
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            className="flex items-center gap-2"
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter size={16} />
            {showFilters ? "Hide Filters" : "Show Filters"}
          </Button>
          <Dialog open={showDialog} onOpenChange={setShowDialog}>
            <DialogTrigger asChild>
              <Button className="flex items-center gap-2">
                <Plus size={16} /> Add Product
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>
                  {editingProductId ? "Edit Product" : "Create New Product"}
                </DialogTitle>
              </DialogHeader>
              <ProductForm
                formData={formData}
                categories={categories}
                isSubmitting={isSubmitting}
                onInputChange={handleInputChange}
                onCategoryChange={handleCategoryChange}
                onSubmit={handleSubmit}
                isEditing={!!editingProductId}
              />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {showFilters && <FilterPanel />}

      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading
          ? renderSkeletons()
          : filteredProducts.map((product) => (
              <ProductCard
                key={product._id}
                product={product}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))}
      </div>
    </div>
  );
};

export default AdminProductPage;
