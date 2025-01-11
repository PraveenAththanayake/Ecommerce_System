import { Request, Response } from "express";
import {
  GeneratePassword,
  GenerateSalt,
  GenerateSignature,
  ValidatePassword,
} from "../../utility";
import {
  CreateUser,
  UserLogin,
  GetUsers,
  GetUserProfile,
  UpdateUserProfile,
  DeleteUser,
} from "../../controllers";
import { User } from "../../models";

// Mock the User model and utility functions
jest.mock("../../models");
jest.mock("../../utility");

describe("User Controller Tests", () => {
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

  describe("CreateUser", () => {
    const mockUserData = {
      firstName: "John",
      lastName: "Doe",
      address: "123 Street",
      email: "john@example.com",
      phone: "1234567890",
      password: "password123",
      role: "user",
    };

    it("should create a new user successfully", async () => {
      // Mock implementations
      const mockSalt = "mockedSalt";
      const mockHashedPassword = "hashedPassword";

      (GenerateSalt as jest.Mock).mockResolvedValue(mockSalt);
      (GeneratePassword as jest.Mock).mockResolvedValue(mockHashedPassword);
      (User.findOne as jest.Mock).mockResolvedValue(null);
      (User.create as jest.Mock).mockResolvedValue({
        ...mockUserData,
        _id: "mockedId",
      });

      mockRequest.body = mockUserData;

      await CreateUser(mockRequest as Request, mockResponse as Response);

      expect(User.create).toHaveBeenCalledWith({
        ...mockUserData,
        password: mockHashedPassword,
        salt: mockSalt,
      });
      expect(mockResponse.json).toHaveBeenCalledWith(
        expect.objectContaining(mockUserData)
      );
    });

    it("should return error if user already exists", async () => {
      (User.findOne as jest.Mock).mockResolvedValue({
        email: mockUserData.email,
      });

      mockRequest.body = mockUserData;

      await CreateUser(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: "User already exists",
      });
    });
  });

  describe("UserLogin", () => {
    const mockLoginData = {
      email: "john@example.com",
      password: "password123",
    };

    const mockFoundUser = {
      _id: "mockedId",
      email: "john@example.com",
      password: "hashedPassword",
      salt: "mockedSalt",
      firstName: "John",
      lastName: "Doe",
      role: "user",
    };

    it("should login successfully with correct credentials", async () => {
      (User.findOne as jest.Mock).mockResolvedValue(mockFoundUser);
      (ValidatePassword as jest.Mock).mockResolvedValue(true);
      (GenerateSignature as jest.Mock).mockResolvedValue("mockedToken");

      mockRequest.body = mockLoginData;

      await UserLogin(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.json).toHaveBeenCalledWith(
        expect.objectContaining({
          _id: mockFoundUser._id,
          token: "mockedToken",
          role: mockFoundUser.role,
          message: "Login successful",
        })
      );
    });

    it("should return error for invalid password", async () => {
      (User.findOne as jest.Mock).mockResolvedValue(mockFoundUser);
      (ValidatePassword as jest.Mock).mockResolvedValue(false);

      mockRequest.body = mockLoginData;

      await UserLogin(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: "Invalid password",
      });
    });
  });

  describe("GetUsers", () => {
    it("should return all users", async () => {
      const mockUsers = [
        { _id: "1", firstName: "John" },
        { _id: "2", firstName: "Jane" },
      ];

      (User.find as jest.Mock).mockResolvedValue(mockUsers);

      await GetUsers(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.json).toHaveBeenCalledWith(mockUsers);
    });

    it("should return message when no users found", async () => {
      (User.find as jest.Mock).mockResolvedValue(null);

      await GetUsers(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.json).toHaveBeenCalledWith({
        message: "No users found",
      });
    });
  });

  describe("GetUserProfile", () => {
    it("should return user profile when authenticated", async () => {
      const mockUser = {
        _id: "mockedId",
        firstName: "John",
        lastName: "Doe",
      };

      mockRequest.user = {
        _id: "mockedId",
        firstName: "John",
        lastName: "Doe",
        email: "john@example.com",
        role: "user",
      };
      (User.findById as jest.Mock).mockResolvedValue(mockUser);

      await GetUserProfile(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.json).toHaveBeenCalledWith(mockUser);
    });

    it("should return error when user not found", async () => {
      mockRequest.user = undefined;

      await GetUserProfile(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.json).toHaveBeenCalledWith({
        message: "User not found",
      });
    });
  });

  describe("UpdateUserProfile", () => {
    const mockUpdateData = {
      firstName: "John Updated",
      lastName: "Doe Updated",
      phone: "0987654321",
      address: "456 Street",
      email: "john.updated@example.com",
    };

    it("should update user profile successfully", async () => {
      const mockUser = {
        ...mockUpdateData,
        save: jest.fn().mockResolvedValue(mockUpdateData),
      };

      mockRequest.user = {
        _id: "mockedId",
        firstName: "John",
        lastName: "Doe",
        email: "john@example.com",
        role: "user",
      };
      mockRequest.body = mockUpdateData;
      (User.findById as jest.Mock).mockResolvedValue(mockUser);

      await UpdateUserProfile(mockRequest as Request, mockResponse as Response);

      expect(mockUser.save).toHaveBeenCalled();
      expect(mockResponse.json).toHaveBeenCalledWith(mockUpdateData);
    });
  });

  describe("DeleteUser", () => {
    it("should delete user successfully", async () => {
      const mockUser = {
        _id: "mockedId",
        deleteOne: jest.fn().mockResolvedValue(undefined),
      };

      mockRequest.user = {
        _id: "mockedId",
        firstName: "John",
        lastName: "Doe",
        email: "john@example.com",
        role: "user",
      };
      (User.findById as jest.Mock).mockResolvedValue(mockUser);

      await DeleteUser(mockRequest as Request, mockResponse as Response);

      expect(mockUser.deleteOne).toHaveBeenCalled();
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: "User deleted",
      });
    });
  });
});
