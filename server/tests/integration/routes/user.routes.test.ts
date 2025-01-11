import request from "supertest";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import { User } from "../../../models";
import app from "../../..";

jest.mock("../../../models", () => ({
  User: {
    create: jest.fn(),
    find: jest.fn(),
    findById: jest.fn(),
    findOne: jest.fn(),
  },
}));

jest.mock("../../../utility", () => ({
  GeneratePassword: jest.fn(() => "hashed_password"),
  GenerateSalt: jest.fn(() => "random_salt"),
  GenerateSignature: jest.fn(() => "mock_token"),
  ValidatePassword: jest.fn(() => true),
  ValidateSignature: jest.fn(),
}));

describe("User Routes", () => {
  describe("POST /register", () => {
    it("should create a new user", async () => {
      const mockUser = {
        firstName: "John",
        lastName: "Doe",
        email: "john.doe@example.com",
        phone: "1234567890",
        address: "123 Street",
        role: "Customer",
        password: "password123",
      };

      (User.findOne as jest.Mock).mockResolvedValueOnce(null);
      (User.create as jest.Mock).mockResolvedValueOnce(mockUser);

      const res = await request(app).post("/user/register").send(mockUser);

      expect(res.status).toBe(200);
      expect(res.body.email).toBe(mockUser.email);
    });

    it("should return 400 if user already exists", async () => {
      const mockUser = { email: "existing@example.com" };
      (User.findOne as jest.Mock).mockResolvedValueOnce(mockUser);

      const res = await request(app).post("/user/register").send(mockUser);

      expect(res.status).toBe(400);
      expect(res.body.message).toBe("User already exists");
    });
  });

  describe("POST /login", () => {
    it("should login an existing user", async () => {
      const mockUser = {
        _id: "mock_user_id",
        email: "john.doe@example.com",
        password: "hashed_password",
      };

      (User.findOne as jest.Mock).mockResolvedValueOnce(mockUser);

      const res = await request(app).post("/user/login").send({
        email: "john.doe@example.com",
        password: "password123",
      });

      expect(res.status).toBe(200);
      expect(res.body.token).toBe("mock_token");
    });

    it("should return 400 if password is invalid", async () => {
      (User.findOne as jest.Mock).mockResolvedValueOnce({
        email: "john.doe@example.com",
        password: "hashed_password",
        salt: "random_salt",
      });

      jest
        .spyOn(require("../../../utility"), "ValidatePassword")
        .mockResolvedValueOnce(false);

      const res = await request(app).post("/user/login").send({
        email: "john.doe@example.com",
        password: "wrong_password",
      });

      expect(res.status).toBe(400);
      expect(res.body.message).toBe("Invalid password");
    });

    it("should return 404 if user is not found", async () => {
      (User.findOne as jest.Mock).mockResolvedValueOnce(null);

      const res = await request(app).post("/user/login").send({
        email: "nonexistent@example.com",
        password: "password123",
      });

      expect(res.status).toBe(404);
      expect(res.body.message).toBe("User not found");
    });
  });
});
