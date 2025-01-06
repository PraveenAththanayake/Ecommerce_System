import { useState, useEffect } from "react";
import { ICategory } from "@/types";
import { getCategories } from "@/services";

const useCategories = () => {
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await getCategories();
        const categoriesWithItemCount = response.map((category: ICategory) => ({
          ...category,
          itemCount: category.itemCount || "0",
        }));
        setCategories(categoriesWithItemCount);
      } catch {
        setError("Error fetching categories");
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  return { categories, loading, error };
};

export default useCategories;
