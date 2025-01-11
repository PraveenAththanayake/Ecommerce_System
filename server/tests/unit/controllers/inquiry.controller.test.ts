import { NextFunction, Request, Response } from "express";
import { Inquiry } from "../../../models";
import {
  CreateInquiry,
  DeleteInquiry,
  FindInquiry,
  GetInquiries,
  GetInquiryById,
  UpdateInquiry,
  GetUserInquiry,
} from "../../../controllers";

// Mock the Inquiry model
jest.mock("../../../models");

describe("Inquiry Controller Tests", () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockNext: NextFunction;
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

    // Setup mock next function
    mockNext = jest.fn();
  });

  describe("CreateInquiry", () => {
    const mockInquiryData = {
      name: "John Doe",
      email: "john@example.com",
      inquiry: "Test inquiry",
    };

    const mockUser = {
      _id: "userId123",
      name: "John Doe",
      email: "john@example.com",
      firstName: "John",
      lastName: "Doe",
      role: "user",
    };

    it("should create a new inquiry successfully", async () => {
      mockRequest.body = mockInquiryData;
      mockRequest.user = mockUser;

      (Inquiry.create as jest.Mock).mockResolvedValue({
        ...mockInquiryData,
        user: mockUser,
        _id: "mockedId",
      });

      await CreateInquiry(mockRequest as Request, mockResponse as Response);

      expect(Inquiry.create).toHaveBeenCalledWith({
        ...mockInquiryData,
        user: mockUser,
      });
      expect(mockResponse.status).toHaveBeenCalledWith(201);
      expect(mockResponse.json).toHaveBeenCalledWith(
        expect.objectContaining(mockInquiryData)
      );
    });

    it("should return error if user is not authenticated", async () => {
      mockRequest.body = mockInquiryData;
      mockRequest.user = undefined;

      await CreateInquiry(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(401);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: "User not authenticated",
      });
    });
  });

  describe("GetInquiries", () => {
    it("should return all inquiries", async () => {
      const mockInquiries = [
        { _id: "1", name: "John", inquiry: "Test 1" },
        { _id: "2", name: "Jane", inquiry: "Test 2" },
      ];

      (Inquiry.find as jest.Mock).mockReturnValue({
        populate: jest.fn().mockReturnValue({
          sort: jest.fn().mockResolvedValue(mockInquiries),
        }),
      });

      await GetInquiries(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.json).toHaveBeenCalledWith(mockInquiries);
    });

    it("should return message when no inquiries found", async () => {
      (Inquiry.find as jest.Mock).mockReturnValue({
        populate: jest.fn().mockReturnValue({
          sort: jest.fn().mockResolvedValue([]),
        }),
      });

      await GetInquiries(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.json).toHaveBeenCalledWith({
        message: "No inquiries found",
      });
    });
  });

  describe("GetInquiryById", () => {
    const mockInquiryId = "mockedId";

    it("should return inquiry when found", async () => {
      const mockInquiry = {
        _id: mockInquiryId,
        name: "John",
        inquiry: "Test inquiry",
      };

      (Inquiry.findById as jest.Mock).mockReturnValue({
        populate: jest.fn().mockResolvedValue(mockInquiry),
      });

      mockRequest.params = { id: mockInquiryId };

      await GetInquiryById(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.json).toHaveBeenCalledWith(mockInquiry);
    });

    it("should return 404 when inquiry not found", async () => {
      (Inquiry.findById as jest.Mock).mockReturnValue({
        populate: jest.fn().mockResolvedValue(null),
      });

      mockRequest.params = { id: mockInquiryId };

      await GetInquiryById(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: "Inquiry not found",
      });
    });
  });

  describe("UpdateInquiry", () => {
    const mockInquiryId = "mockedId";
    const mockUser = {
      _id: "userId123",
      name: "John Doe",
      email: "john@example.com",
      firstName: "John",
      lastName: "Doe",
      role: "user",
    };
    const mockUpdateData = {
      name: "Updated Name",
      email: "updated@example.com",
      inquiry: "Updated inquiry",
    };

    it("should update inquiry successfully", async () => {
      const mockInquiry = {
        _id: mockInquiryId,
        user: mockUser._id,
      };

      (Inquiry.findById as jest.Mock).mockResolvedValue(mockInquiry);
      (Inquiry.findByIdAndUpdate as jest.Mock).mockResolvedValue({
        ...mockInquiry,
        ...mockUpdateData,
      });

      mockRequest.params = { id: mockInquiryId };
      mockRequest.body = mockUpdateData;
      mockRequest.user = mockUser;

      await UpdateInquiry(mockRequest as Request, mockResponse as Response);

      expect(Inquiry.findByIdAndUpdate).toHaveBeenCalledWith(
        mockInquiryId,
        mockUpdateData,
        { new: true, runValidators: true }
      );
      expect(mockResponse.json).toHaveBeenCalledWith(
        expect.objectContaining(mockUpdateData)
      );
    });

    it("should return 404 when inquiry not found", async () => {
      (Inquiry.findById as jest.Mock).mockResolvedValue(null);

      mockRequest.params = { id: mockInquiryId };
      mockRequest.body = mockUpdateData;
      mockRequest.user = mockUser;

      await UpdateInquiry(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: "Inquiry not found",
      });
    });

    it("should return 403 when user is not authorized", async () => {
      const mockInquiry = {
        _id: mockInquiryId,
        user: "differentUserId",
      };

      (Inquiry.findById as jest.Mock).mockResolvedValue(mockInquiry);

      mockRequest.params = { id: mockInquiryId };
      mockRequest.body = mockUpdateData;
      mockRequest.user = mockUser;

      await UpdateInquiry(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(403);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: "Not authorized to update this inquiry",
      });
    });
  });

  describe("DeleteInquiry", () => {
    const mockInquiryId = "mockedId";

    it("should delete inquiry successfully", async () => {
      const mockInquiry = {
        _id: mockInquiryId,
        name: "John",
      };

      (Inquiry.findById as jest.Mock).mockResolvedValue(mockInquiry);
      (Inquiry.deleteOne as jest.Mock).mockResolvedValue(undefined);

      mockRequest.params = { id: mockInquiryId };

      await DeleteInquiry(mockRequest as Request, mockResponse as Response);

      expect(Inquiry.deleteOne).toHaveBeenCalledWith({ _id: mockInquiryId });
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: "Inquiry deleted successfully",
      });
    });

    it("should return 404 when inquiry not found", async () => {
      (Inquiry.findById as jest.Mock).mockResolvedValue(null);

      mockRequest.params = { id: mockInquiryId };

      await DeleteInquiry(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: "Inquiry not found",
      });
    });
  });

  describe("GetUserInquiry", () => {
    const mockUser = {
      _id: "userId123",
      name: "John Doe",
      email: "john@example.com",
      firstName: "John",
      lastName: "Doe",
      role: "user",
    };

    it("should return user's inquiries successfully", async () => {
      const mockInquiries = [
        { _id: "1", inquiry: "Test 1", user: mockUser._id },
        { _id: "2", inquiry: "Test 2", user: mockUser._id },
      ];

      (Inquiry.find as jest.Mock).mockResolvedValue(mockInquiries);

      mockRequest.user = mockUser;

      await GetUserInquiry(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(Inquiry.find).toHaveBeenCalledWith({ user: mockUser._id });
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: true,
        count: mockInquiries.length,
        inquiry: mockInquiries,
      });
    });

    it("should return 401 when user is not authenticated", async () => {
      mockRequest.user = undefined;

      await GetUserInquiry(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(mockResponse.status).toHaveBeenCalledWith(401);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: "User not authenticated",
      });
    });

    it("should call next with error when exception occurs", async () => {
      const error = new Error("Database error");
      (Inquiry.find as jest.Mock).mockRejectedValue(error);

      mockRequest.user = mockUser;

      await GetUserInquiry(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });
});
