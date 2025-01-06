import { useState } from "react";
import { IProduct } from "@/types";

export const useProductForm = (initialData?: Partial<IProduct>) => {
  const [formData, setFormData] = useState({
    name: initialData?.name || "",
    description: initialData?.description || "",
    price: initialData?.price?.toString() || "",
    image: initialData?.imageUrl || "",
    category: initialData?.category || "",
    stock: initialData?.countInStock?.toString() || "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCategoryChange = (value: string) => {
    setFormData((prev) => ({ ...prev, category: value }));
  };

  return {
    formData,
    isSubmitting,
    error,
    setIsSubmitting,
    setError,
    handleInputChange,
    handleCategoryChange,
    resetForm: () =>
      setFormData({
        name: "",
        description: "",
        price: "",
        image: "",
        category: "",
        stock: "",
      }),
  };
};
