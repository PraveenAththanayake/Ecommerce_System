import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FilterState, ICategory } from "@/types";

interface FilterPanelProps {
  filters: FilterState;
  categories: ICategory[];
  onFilterChange: (filters: FilterState) => void;
  onReset: () => void;
}

export const FilterPanel: React.FC<FilterPanelProps> = ({
  filters,
  categories,
  onFilterChange,
  onReset,
}) => (
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
              onFilterChange({ ...filters, search: e.target.value })
            }
          />
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Category</label>
        <Select
          value={filters.category}
          onValueChange={(value) =>
            onFilterChange({ ...filters, category: value })
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
              onFilterChange({
                ...filters,
                priceRange: { ...filters.priceRange, min: e.target.value },
              })
            }
          />
          <Input
            type="number"
            placeholder="Max"
            value={filters.priceRange.max}
            onChange={(e) =>
              onFilterChange({
                ...filters,
                priceRange: { ...filters.priceRange, max: e.target.value },
              })
            }
          />
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Stock Status</label>
        <Select
          value={filters.stockStatus}
          onValueChange={(value) =>
            onFilterChange({ ...filters, stockStatus: value })
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
      <Button variant="outline" onClick={onReset}>
        Reset Filters
      </Button>
    </div>
  </div>
);
