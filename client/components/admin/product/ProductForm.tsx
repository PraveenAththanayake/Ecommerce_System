import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import { ProductFormProps } from "@/types";

export const ProductForm: React.FC<ProductFormProps> = ({
  formData,
  categories,
  isSubmitting,
  onInputChange,
  onCategoryChange,
  onSubmit,
  isEditing,
}) => (
  <div className="space-y-4 py-4">
    <div className="space-y-2">
      <Input
        name="name"
        placeholder="Product Name"
        value={formData.name}
        onChange={onInputChange}
        required
      />
    </div>
    <div className="space-y-2">
      <Textarea
        name="description"
        placeholder="Product Description"
        value={formData.description}
        onChange={onInputChange}
        className="min-h-[100px]"
      />
    </div>
    <div className="grid grid-cols-2 gap-4">
      <Input
        name="price"
        type="number"
        step="0.01"
        placeholder="Price"
        value={formData.price}
        onChange={onInputChange}
        required
      />
      <Input
        name="stock"
        type="number"
        placeholder="Stock"
        value={formData.stock}
        onChange={onInputChange}
        required
      />
    </div>
    <div className="space-y-2">
      <Input
        name="image"
        placeholder="Image URL"
        value={formData.image}
        onChange={onInputChange}
      />
    </div>
    <div className="space-y-2">
      <Select value={formData.category} onValueChange={onCategoryChange}>
        <SelectTrigger>
          <SelectValue placeholder="Select Category" />
        </SelectTrigger>
        <SelectContent>
          {categories.map((category) => (
            <SelectItem key={category._id} value={category.name}>
              {category.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
    <Button className="w-full" onClick={onSubmit} disabled={isSubmitting}>
      {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      {isEditing ? "Update Product" : "Create Product"}
    </Button>
  </div>
);
