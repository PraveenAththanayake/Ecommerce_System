import { Request, Response } from "express";
import { Category } from "../../../models";
import {
  CreateCategory,
  DeleteCategory,
  FindCategory,
  GetCategories,
  GetCategoryById,
  UpdateCategory,
} from "../../../controllers";

// Mock the Category model
jest.mock("../../../models");

describe("Category Controller Tests", () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let responseObject: any = {};

  beforeEach(() => {
    // Reset mocks before each test
    jest.clearAllMocks();

    // Setup mock response
    mockResponse = {
      json: jest.fn().mockImplementation((result) => {
        responseObject = result;
        return mockResponse;
      }),
      status: jest.fn().mockReturnThis(),
    };

    // Setup mock request
    mockRequest = {};
  });

  describe("CreateCategory", () => {
    const mockCategoryData = {
      name: "Electronics",
      slug: "electronics",
      image: "electronics.jpg",
      description: "Electronic items category",
    };

    it("should create a new category successfully", async () => {
      (Category.findOne as jest.Mock).mockResolvedValue(null);
      (Category.create as jest.Mock).mockResolvedValue({
        ...mockCategoryData,
        _id: "mockedId",
      });

      mockRequest.body = mockCategoryData;

      await CreateCategory(mockRequest as Request, mockResponse as Response);

      expect(Category.create).toHaveBeenCalledWith(mockCategoryData);
      expect(mockResponse.json).toHaveBeenCalledWith(
        expect.objectContaining(mockCategoryData)
      );
    });

    it("should return error if category already exists", async () => {
      (Category.findOne as jest.Mock).mockResolvedValue({
        name: mockCategoryData.name,
      });

      mockRequest.body = mockCategoryData;

      await CreateCategory(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: "Category already exists",
      });
    });
  });

  describe("GetCategories", () => {
    it("should return all categories", async () => {
      const mockCategories = [
        { _id: "1", name: "Electronics" },
        { _id: "2", name: "Clothing" },
      ];

      (Category.find as jest.Mock).mockResolvedValue(mockCategories);

      await GetCategories(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.json).toHaveBeenCalledWith(mockCategories);
    });

    it("should return message when no categories found", async () => {
      (Category.find as jest.Mock).mockResolvedValue(null);

      await GetCategories(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.json).toHaveBeenCalledWith({
        message: "No categories found",
      });
    });
  });

  describe("GetCategoryById", () => {
    const mockCategoryId = "mockedId";

    it("should return category when found", async () => {
      const mockCategory = {
        _id: mockCategoryId,
        name: "Electronics",
        slug: "electronics",
      };

      (Category.findOne as jest.Mock).mockResolvedValue(mockCategory);

      mockRequest.params = { id: mockCategoryId };

      await GetCategoryById(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.json).toHaveBeenCalledWith(mockCategory);
    });

    it("should return message when category not found", async () => {
      (Category.findOne as jest.Mock).mockResolvedValue(null);

      mockRequest.params = { id: mockCategoryId };

      await GetCategoryById(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.json).toHaveBeenCalledWith({
        message: "Category not found",
      });
    });
  });

  describe("UpdateCategory", () => {
    const mockCategoryId = "mockedId";
    const mockUpdateData = {
      name: "Updated Electronics",
      slug: "updated-electronics",
      image: "updated-electronics.jpg",
      description: "Updated electronic items category",
    };

    it("should update category successfully", async () => {
      const mockCategory = {
        _id: mockCategoryId,
        ...mockUpdateData,
        save: jest.fn().mockResolvedValue(mockUpdateData),
      };

      (Category.findById as jest.Mock).mockResolvedValue(mockCategory);

      mockRequest.params = { id: mockCategoryId };
      mockRequest.body = mockUpdateData;

      await UpdateCategory(mockRequest as Request, mockResponse as Response);

      expect(mockCategory.save).toHaveBeenCalled();
      expect(mockResponse.json).toHaveBeenCalledWith(
        expect.objectContaining(mockUpdateData)
      );
    });

    it("should return message when category not found", async () => {
      (Category.findById as jest.Mock).mockResolvedValue(null);

      mockRequest.params = { id: mockCategoryId };
      mockRequest.body = mockUpdateData;

      await UpdateCategory(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.json).toHaveBeenCalledWith({
        message: "Category not found",
      });
    });
  });

  describe("DeleteCategory", () => {
    const mockCategoryId = "mockedId";

    it("should delete category successfully", async () => {
      const mockCategory = {
        _id: mockCategoryId,
        name: "Electronics",
      };

      (Category.findById as jest.Mock).mockResolvedValue(mockCategory);
      (Category.deleteOne as jest.Mock).mockResolvedValue(undefined);

      mockRequest.params = { id: mockCategoryId };

      await DeleteCategory(mockRequest as Request, mockResponse as Response);

      expect(Category.deleteOne).toHaveBeenCalledWith({ _id: mockCategoryId });
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: "Category deleted",
      });
    });

    it("should return message when category not found", async () => {
      (Category.findById as jest.Mock).mockResolvedValue(null);

      mockRequest.params = { id: mockCategoryId };

      await DeleteCategory(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.json).toHaveBeenCalledWith({
        message: "Category not found",
      });
    });
  });

  describe("FindCategory", () => {
    it("should find category by name", async () => {
      const mockCategory = {
        _id: "mockedId",
        name: "Electronics",
      };

      (Category.findOne as jest.Mock).mockResolvedValue(mockCategory);

      const result = await FindCategory(undefined, "Electronics");

      expect(Category.findOne).toHaveBeenCalledWith({ name: "Electronics" });
      expect(result).toEqual(mockCategory);
    });

    it("should find category by id", async () => {
      const mockCategory = {
        _id: "mockedId",
        name: "Electronics",
      };

      (Category.findById as jest.Mock).mockResolvedValue(mockCategory);

      const result = await FindCategory("mockedId");

      expect(Category.findById).toHaveBeenCalledWith("mockedId");
      expect(result).toEqual(mockCategory);
    });
  });
});
