import { NextFunction, Request, Response } from "express";
import { Product, Review } from "../../../models";
import {
  CreateReview,
  GetReviews,
  GetReviewById,
  GetUserReviews,
} from "../../../controllers";

// Mock the models
jest.mock("../../../models");

describe("Review Controller Tests", () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockNext: NextFunction;

  beforeEach(() => {
    jest.clearAllMocks();

    mockResponse = {
      json: jest.fn().mockReturnThis(),
      status: jest.fn().mockReturnThis(),
    };

    mockRequest = {};
    mockNext = jest.fn();
  });

  describe("CreateReview", () => {
    const mockUser = {
      _id: "userId123",
      name: "John Doe",
      email: "john@example.com",
      firstName: "John",
      lastName: "Doe",
      role: "user",
    };

    const mockReviewData = {
      product: "productId123",
      name: "Great Product",
      rating: 5,
      comment: "Excellent quality",
    };

    it("should create a new review successfully", async () => {
      const mockProduct = {
        _id: "productId123",
        rating: 4,
        numReviews: 2,
        save: jest.fn(),
      };

      mockRequest.body = mockReviewData;
      mockRequest.user = mockUser;

      (Review.findOne as jest.Mock).mockResolvedValue(null);
      (Review.create as jest.Mock).mockResolvedValue({
        ...mockReviewData,
        user: mockUser._id,
      });
      (Product.findById as jest.Mock).mockResolvedValue(mockProduct);

      await CreateReview(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(Review.create).toHaveBeenCalledWith({
        ...mockReviewData,
        user: mockUser._id,
      });
      expect(mockProduct.save).toHaveBeenCalled();
      expect(mockResponse.status).toHaveBeenCalledWith(201);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: true,
        review: expect.objectContaining(mockReviewData),
      });
    });

    it("should return 401 if user is not authenticated", async () => {
      mockRequest.body = mockReviewData;
      mockRequest.user = undefined;

      await CreateReview(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(mockResponse.status).toHaveBeenCalledWith(401);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: "User not authenticated",
      });
    });

    it("should return 400 if user has already reviewed the product", async () => {
      mockRequest.body = mockReviewData;
      mockRequest.user = mockUser;

      (Review.findOne as jest.Mock).mockResolvedValue({
        _id: "existingReviewId",
      });

      await CreateReview(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: "You have already reviewed this product",
      });
    });
  });

  describe("GetReviews", () => {
    it("should return all reviews for a product", async () => {
      const mockReviews = [
        { _id: "1", rating: 5, comment: "Great" },
        { _id: "2", rating: 4, comment: "Good" },
      ];

      mockRequest.params = { productId: "productId123" };

      (Review.find as jest.Mock).mockReturnValue({
        populate: jest.fn().mockReturnValue({
          sort: jest.fn().mockResolvedValue(mockReviews),
        }),
      });

      await GetReviews(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: true,
        count: 2,
        reviews: mockReviews,
      });
    });

    it("should return 400 if productId is not provided", async () => {
      mockRequest.params = {};

      await GetReviews(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: "Product ID is required",
      });
    });
  });

  describe("GetReviewById", () => {
    it("should return review when found", async () => {
      const mockReview = {
        _id: "reviewId123",
        rating: 5,
        comment: "Excellent",
      };

      mockRequest.params = { id: "reviewId123" };

      (Review.findById as jest.Mock).mockReturnValue({
        populate: jest.fn().mockResolvedValue(mockReview),
      });

      await GetReviewById(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: true,
        review: mockReview,
      });
    });

    it("should return 404 when review not found", async () => {
      mockRequest.params = { id: "nonexistentId" };

      (Review.findById as jest.Mock).mockReturnValue({
        populate: jest.fn().mockResolvedValue(null),
      });

      await GetReviewById(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: "Review not found",
      });
    });
  });

  describe("GetUserReviews", () => {
    const mockUser = {
      _id: "userId123",
      name: "John Doe",
      email: "john@example.com",
      firstName: "John",
      lastName: "Doe",
      role: "user",
    };
    it("should return user's reviews successfully", async () => {
      const mockReviews = [
        { _id: "1", rating: 5, comment: "Great" },
        { _id: "2", rating: 4, comment: "Good" },
      ];

      mockRequest.user = mockUser;

      (Review.find as jest.Mock).mockReturnValue({
        populate: jest.fn().mockResolvedValue(mockReviews),
      });

      await GetUserReviews(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: true,
        count: 2,
        reviews: mockReviews,
      });
    });

    it("should return 401 if user is not authenticated", async () => {
      mockRequest.user = undefined;

      await GetUserReviews(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(mockResponse.status).toHaveBeenCalledWith(401);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: "User not authenticated",
      });
    });
  });
});
