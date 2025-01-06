import React from "react";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Edit, Trash2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { IProduct } from "@/types";

interface ProductCardProps {
  product: IProduct;
  onEdit: (product: IProduct) => void;
  onDelete: (id: string) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onEdit,
  onDelete,
}) => (
  <Card className="overflow-hidden group">
    <CardContent className="p-0">
      <div className="relative">
        <Image
          width={400}
          height={300}
          src={product.imageUrl || "/placeholder.png"}
          alt={product.name}
          className="w-full h-48 object-cover"
        />
        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
          <Button size="sm" variant="secondary" onClick={() => onEdit(product)}>
            <Edit size={16} />
          </Button>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button size="sm" variant="destructive">
                <Trash2 size={16} />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete Product</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to delete &quot;{product.name}&quot;?
                  This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={() => onDelete(product._id)}>
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
      <div className="p-4 space-y-2">
        <h3 className="text-lg font-semibold leading-none tracking-tight">
          {product.name}
        </h3>
        <p className="text-sm text-muted-foreground line-clamp-2">
          {product.description}
        </p>
        <div className="flex justify-between items-center">
          <p className="text-sm font-medium">${product.price.toFixed(2)}</p>
          <p className="text-sm text-muted-foreground">
            Stock: {product.countInStock}
          </p>
        </div>
        <p className="text-sm text-muted-foreground">
          Category: {product.category}
        </p>
      </div>
    </CardContent>
  </Card>
);
