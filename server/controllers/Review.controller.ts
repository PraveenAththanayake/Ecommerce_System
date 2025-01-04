import { Request, Response, NextFunction } from "express";
import { Product, Review } from "../models";

// Create Review
export const CreateReview = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { product, name, rating, comment } = req.body;
    const user = req.user;

    if (!user) {
      res.status(401).json({ message: "User not authenticated" });
      return;
    }

    const existingReview = await Review.findOne({ product, user: user._id });

    if (existingReview) {
      res
        .status(400)
        .json({ message: "You have already reviewed this product" });
      return;
    }

    const newReview = await Review.create({
      name,
      rating,
      comment,
      user: user._id,
      product,
    });

    // Update product's average rating and review count
    const productDetails = await Product.findById(product);

    if (productDetails) {
      const totalReviews = (productDetails.numReviews || 0) + 1;
      const totalRating =
        (productDetails.rating || 0) * (productDetails.numReviews || 0) +
        rating;

      productDetails.rating = totalRating / totalReviews;
      productDetails.numReviews = totalReviews;
      await productDetails.save();
    }

    res.status(201).json({
      success: true,
      review: newReview,
    });
  } catch (error) {
    next(error);
  }
};

// Get All Reviews for a Product
export const GetReviews = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { productId } = req.params;

    const reviews = await Review.find({ product: productId })
      .populate("user", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: reviews.length,
      reviews,
    });
  } catch (error) {
    next(error);
  }
};

// Get Review by ID
export const GetReviewById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;

    const review = await Review.findById(id).populate("user", "name email");

    if (!review) {
      res.status(404).json({ message: "Review not found" });
      return;
    }

    res.status(200).json({
      success: true,
      review,
    });
  } catch (error) {
    next(error);
  }
};

// Update Review
export const UpdateReview = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const { rating, comment } = req.body;

    const review = await Review.findById(id);

    if (!review) {
      res.status(404).json({ message: "Review not found" });
      return;
    }

    review.rating = rating || review.rating;
    review.comment = comment || review.comment;

    await review.save();

    res.status(200).json({
      success: true,
      review,
    });
  } catch (error) {
    next(error);
  }
};

// Delete Review
export const DeleteReview = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;

    const review = await Review.findById(id);

    if (!review) {
      res.status(404).json({ message: "Review not found" });
      return;
    }

    await review.deleteOne();

    // Update product's average rating and review count
    const productDetails = await Product.findById(review.product);

    if (productDetails) {
      const totalReviews = (productDetails.numReviews || 0) - 1;
      const totalRating =
        totalReviews > 0
          ? ((productDetails.rating || 0) * (productDetails.numReviews ?? 0) -
              review.rating) /
            totalReviews
          : 0;

      productDetails.rating = totalRating;
      productDetails.numReviews = totalReviews;
      await productDetails.save();
    }

    res.status(200).json({
      success: true,
      message: "Review deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

// Get User's Reviews
export const GetUserReviews = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = req.user;

    if (!user) {
      res.status(401).json({ message: "User not authenticated" });
      return;
    }

    const reviews = await Review.find({ user: user._id }).populate(
      "product",
      "name"
    );

    res.status(200).json({
      success: true,
      count: reviews.length,
      reviews,
    });
  } catch (error) {
    next(error);
  }
};
