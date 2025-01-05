import { Request, Response } from "express";
import { Category } from "../models";
import { CreateCategoryInput } from "../dto";

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
  const { name, slug, image, description } = <CreateCategoryInput>req.body;

  const existingCategory = await FindCategory("", name);

  if (existingCategory) {
    res.status(400).json({ message: "Category already exists" });
    return;
  }

  const createCategory = await Category.create({
    name: name,
    slug: slug,
    image: image,
    description: description,
  });

  res.json(createCategory);
  return;
};

// Get Categories function
export const GetCategories = async (req: Request, res: Response) => {
  const categories = await Category.find();

  if (categories != null) {
    res.json(categories);
    return;
  } else {
    res.json({ message: "No categories found" });
    return;
  }
};

// Get Category by ID function
export const GetCategoryById = async (req: Request, res: Response) => {
  const { id } = req.params;
  const category = await Category.findOne({ _id: id });

  if (category != null) {
    res.json(category);
    return;
  } else {
    res.json({ message: "Category not found" });
    return;
  }
};

// Update Category function
export const UpdateCategory = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name, slug, image, description } = <CreateCategoryInput>req.body;

  const category = await FindCategory(id);

  if (category != null) {
    category.name = name;
    category.slug = slug;
    category.image = image;
    category.description = description;

    await category.save();
    res.json(category);
    return;
  } else {
    res.json({ message: "Category not found" });
    return;
  }
};

// Delete Category function
export const DeleteCategory = async (req: Request, res: Response) => {
  const { id } = req.params;
  const category = await FindCategory(id);

  if (category != null) {
    await Category.deleteOne({ _id: id });
    res.json({ message: "Category deleted" });
    return;
  } else {
    res.json({ message: "Category not found" });
    return;
  }
};
