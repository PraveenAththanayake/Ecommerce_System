import { Request, Response } from "express";
import { Category } from "../models";
import { CreateCategoryInput } from "../dto";
import mongoose from "mongoose";

// FindCategory function
export const FindCategory = async (id: string | undefined, name?: string) => {
  if (name) {
    return await Category.findOne({ name: name });
  } else {
    return await Category.findById(id);
  }
};

// Create Category function
export const CreateCategory = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { name, slug, featured } = <CreateCategoryInput>req.body;

  const existingCategory = await FindCategory("", name);

  if (existingCategory) {
    res.status(400).json({ message: "Category already exists" });
    return;
  }

  const createCategory = await Category.create({
    name: name,
    slug: slug,
    featured: featured,
  });

  res.json(createCategory);
};

// Get Categories function
export const GetCategories = async (req: Request, res: Response) => {
  const categories = await Category.find();

  if (categories != null) {
    res.json(categories);
  } else {
    res.json({ message: "No categories found" });
  }
};

// Get Category by ID function
export const GetCategoryById = async (req: Request, res: Response) => {
  const { id } = req.params;
  const category = await Category.findOne({ _id: id });

  if (category != null) {
    res.json(category);
  } else {
    res.json({ message: "Category not found" });
  }
};

// Update Category function
export const UpdateCategory = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name, slug, featured } = <CreateCategoryInput>req.body;

  const category = await FindCategory(id);

  if (category != null) {
    category.name = name;
    category.slug = slug;
    category.featured = featured;

    await category.save();
    res.json(category);
  } else {
    res.json({ message: "Category not found" });
  }
};

// Delete Category function
export const DeleteCategory = async (req: Request, res: Response) => {
  const { id } = req.params;
  const category = await FindCategory(id);

  if (category != null) {
    await Category.deleteOne({ _id: id });
    res.json({ message: "Category deleted" });
  } else {
    res.json({ message: "Category not found" });
  }
};
