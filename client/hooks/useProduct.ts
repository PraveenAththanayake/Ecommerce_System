import { useState, useEffect } from "react";
import { IProduct, ICategory } from "@/types";
import { getProducts, getCategories } from "@/services";

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

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getProducts();
      if (Array.isArray(data)) {
        setProducts(data);
      } else {
        throw new Error("Invalid products data received");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch products");
      setProducts([]);
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
    categories,
    loading,
    error,
    filters,
    setFilters,
  };
};
