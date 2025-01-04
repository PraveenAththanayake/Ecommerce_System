import { Request, Response } from "express";
import { Product } from "../models";
import { ProductDto } from "../dto";

// Helper function to find product by ID or slug
export const FindProduct = async (id?: string, slug?: string) => {
  if (slug) {
    return await Product.findOne({ slug });
  } else if (id) {
    return await Product.findById(id);
  }
  return null;
};

// Create Product function
export const CreateProduct = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { name, description, price, countInStock, category, slug, imageUrl } =
      <ProductDto>req.body;

    const existingProduct = await FindProduct(undefined, slug);

    if (existingProduct) {
      res
        .status(400)
        .json({ message: "Product with the same slug already exists" });
      return;
    }

    const newProduct = await Product.create({
      name,
      description,
      price,
      countInStock,
      category,
      slug,
      imageUrl,
    });

    res.status(201).json(newProduct);
  } catch (error) {
    res.status(500).json({ message: "Error creating product", error });
  }
};

// Get All Products function
export const GetProducts = async (req: Request, res: Response) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });

    if (products.length > 0) {
      res.json(products);
    } else {
      res.json({ message: "No products found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error fetching products", error });
  }
};

// Get Product by ID function
export const GetProductById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const product = await FindProduct(id);

    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ message: "Product not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error fetching product", error });
  }
};

// Update Product function
export const UpdateProduct = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, description, price, countInStock, category, slug, imageUrl } =
      <ProductDto>req.body;

    const existingProduct = await FindProduct(id);

    if (existingProduct) {
      existingProduct.name = name;
      existingProduct.description = description;
      existingProduct.price = price;
      existingProduct.countInStock = countInStock;
      existingProduct.category = category;
      existingProduct.slug = slug;
      existingProduct.imageUrl = imageUrl;

      const updatedProduct = await existingProduct.save();
      res.json(updatedProduct);
    } else {
      res.status(404).json({ message: "Product not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error updating product", error });
  }
};

// Delete Product function
export const DeleteProduct = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const product = await FindProduct(id);

    if (product) {
      await Product.deleteOne({ _id: id });
      res.json({ message: "Product deleted successfully" });
    } else {
      res.status(404).json({ message: "Product not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error deleting product", error });
  }
};
