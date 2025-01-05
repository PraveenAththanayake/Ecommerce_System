"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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
import { Trash2, Edit, Plus, Loader2 } from "lucide-react";
import Image from "next/image";
import {
  createCategory,
  deleteCategory,
  getCategories,
  updateCategory,
} from "@/services";
import { ICategory } from "@/types";

const AdminCategoryPage = () => {
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    image: "",
    slug: "",
  });
  const [editingCategoryId, setEditingCategoryId] = useState<string | null>(
    null
  );

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getCategories();
      setCategories(data);
    } catch {
      setError("Failed to fetch categories. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      image: "",
      slug: "",
    });
    setEditingCategoryId(null);
    setShowDialog(false);
  };

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);
      setError(null);

      const categoryData: ICategory = {
        _id: editingCategoryId || "",
        ...formData,
        itemCount: 0,
      };

      if (editingCategoryId) {
        await updateCategory(editingCategoryId, categoryData);
      } else {
        await createCategory(categoryData);
      }

      resetForm();
      fetchCategories();
    } catch {
      setError(
        `Failed to ${
          editingCategoryId ? "update" : "create"
        } category. Please try again.`
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (category: ICategory) => {
    setEditingCategoryId(category._id);
    setFormData({
      name: category.name,
      description: category.description,
      image: category.image,
      slug: category.slug,
    });
    setShowDialog(true);
  };

  const handleDelete = async (id: string) => {
    try {
      setError(null);
      await deleteCategory(id);
      fetchCategories();
    } catch {
      setError("Failed to delete category. Please try again.");
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Categories</h1>
        <Dialog open={showDialog} onOpenChange={setShowDialog}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <Plus size={16} /> Add Category
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>
                {editingCategoryId ? "Edit Category" : "Create New Category"}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Input
                  name="name"
                  placeholder="Category Name"
                  value={formData.name}
                  onChange={handleInputChange}
                />
              </div>
              <div className="space-y-2">
                <Textarea
                  name="description"
                  placeholder="Category Description"
                  value={formData.description}
                  onChange={handleInputChange}
                  className="min-h-[100px]"
                />
              </div>
              <div className="space-y-2">
                <Input
                  name="image"
                  placeholder="Image URL"
                  value={formData.image}
                  onChange={handleInputChange}
                />
              </div>
              <div className="space-y-2">
                <Input
                  name="slug"
                  placeholder="category-slug"
                  value={formData.slug}
                  onChange={handleInputChange}
                />
              </div>
              <Button
                className="w-full"
                onClick={handleSubmit}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : null}
                {editingCategoryId ? "Update Category" : "Create Category"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading
          ? Array(6)
              .fill(0)
              .map((_, i) => (
                <Card key={i} className="overflow-hidden">
                  <CardContent className="p-0">
                    <Skeleton className="h-48 rounded-t-lg" />
                    <div className="p-4 space-y-3">
                      <Skeleton className="h-4 w-3/4" />
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-1/2" />
                    </div>
                  </CardContent>
                </Card>
              ))
          : categories.map((category) => (
              <Card key={category._id} className="overflow-hidden group">
                <CardContent className="p-0">
                  <div className="relative">
                    <Image
                      width={400}
                      height={300}
                      src={category.image || "/placeholder.png"}
                      alt={category.name}
                      className="w-full h-48 object-cover"
                    />
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => handleEdit(category)}
                      >
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
                            <AlertDialogTitle>Delete Category</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to delete &quot;
                              {category.name}&quot;? This action cannot be
                              undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDelete(category._id)}
                            >
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                  <div className="p-4 space-y-2">
                    <h3 className="text-lg font-semibold leading-none tracking-tight">
                      {category.name}
                    </h3>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {category.description}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Slug: {category.slug}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
      </div>
    </div>
  );
};

export default AdminCategoryPage;
