import { useState, useEffect } from "react";
import { IProduct, ICategory } from "@/types";
import {
  deleteProduct,
  getProducts,
  updateProduct,
  getCategories,
} from "@/services";

interface FilterState {
  category: string;
  search: string;
  priceRange: {
    min: string;
    max: string;
  };
  stockStatus: string;
}

export const useProducts = () => {
  const [products, setProducts] = useState<IProduct[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<IProduct[]>([]);
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<FilterState>({
    category: "all",
    search: "",
    priceRange: { min: "", max: "" },
    stockStatus: "all",
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

    if (filters.category !== "all") {
      filtered = filtered.filter(
        (product) => product.category === filters.category
      );
    }

    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(
        (product) =>
          product.name.toLowerCase().includes(searchLower) ||
          product.description.toLowerCase().includes(searchLower)
      );
    }

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
        throw new Error("Invalid products data received");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch products");
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
        throw new Error("Invalid categories data received");
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to fetch categories"
      );
      setCategories([]);
    }
  };

  return {
    products,
    filteredProducts,
    categories,
    loading,
    error,
    filters,
    setFilters,
    refreshProducts: fetchProducts,
    handleEdit: async (product: IProduct) => {
      try {
        await updateProduct(product._id, product);
        await fetchProducts();
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to update product"
        );
      }
    },
    handleDelete: async (id: string) => {
      try {
        await deleteProduct(id);
        await fetchProducts();
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to delete product"
        );
      }
    },
  };
};
