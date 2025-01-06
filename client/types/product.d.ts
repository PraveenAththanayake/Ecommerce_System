interface IProduct {
  _id: string;
  name: string;
  description: string;
  price: number;
  countInStock: number;
  imageUrl: string;
  category: string;
  slug: string;
  numReviews: number;
  rating: number;
  reviews?: IReview[];
}
export interface ProductFormData {
  name: string;
  description: string;
  price: string;
  image: string;
  category: string;
  stock: string;
}

export interface FilterState {
  category: string;
  search: string;
  priceRange: {
    min: string;
    max: string;
  };
  stockStatus: string;
}

export interface ProductFormProps {
  formData: ProductFormData;
  categories: ICategory[];
  isSubmitting: boolean;
  onInputChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  onCategoryChange: (value: string) => void;
  onSubmit: () => void;
  isEditing: boolean;
}

export interface CartItem extends IProduct {
  quantity: number;
}
