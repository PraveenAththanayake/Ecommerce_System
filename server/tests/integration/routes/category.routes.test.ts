import request from "supertest";
import mongoose from "mongoose";
import { Category } from "../../../models";
import app from "../../..";

jest.mock("../../../models", () => ({
  Category: {
    create: jest.fn(),
    find: jest.fn(),
    findById: jest.fn(),
    findOne: jest.fn(),
    deleteOne: jest.fn(),
  },
}));

describe("Category Routes", () => {
  const mockCategory = {
    _id: "mock_category_id",
    name: "Electronics",
    slug: "electronics",
    description: "Electronic items",
    image: "electronics.jpg",
  };

  describe("POST /create", () => {
    it("should create a new category", async () => {
      (Category.findOne as jest.Mock).mockResolvedValueOnce(null);
      (Category.create as jest.Mock).mockResolvedValueOnce(mockCategory);

      const res = await request(app)
        .post("/category/create")
        .send(mockCategory);

      expect(res.status).toBe(200);
      expect(res.body.name).toBe(mockCategory.name);
    });

    it("should return 400 if category already exists", async () => {
      (Category.findOne as jest.Mock).mockResolvedValueOnce(mockCategory);

      const res = await request(app)
        .post("/category/create")
        .send(mockCategory);

      expect(res.status).toBe(400);
      expect(res.body.message).toBe("Category already exists");
    });
  });

  describe("GET /get", () => {
    it("should return all categories", async () => {
      const mockCategories = [mockCategory];
      (Category.find as jest.Mock).mockResolvedValueOnce(mockCategories);

      const res = await request(app).get("/category/get");

      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBeTruthy();
      expect(res.body[0].name).toBe(mockCategory.name);
    });

    it("should return message when no categories found", async () => {
      (Category.find as jest.Mock).mockResolvedValueOnce(null);

      const res = await request(app).get("/category/get");

      expect(res.status).toBe(200);
      expect(res.body.message).toBe("No categories found");
    });
  });

  describe("GET /get/:id", () => {
    it("should return category by id", async () => {
      (Category.findOne as jest.Mock).mockResolvedValueOnce(mockCategory);

      const res = await request(app).get(`/category/get/${mockCategory._id}`);

      expect(res.status).toBe(200);
      expect(res.body.name).toBe(mockCategory.name);
    });

    it("should return message when category not found", async () => {
      (Category.findOne as jest.Mock).mockResolvedValueOnce(null);

      const res = await request(app).get("/category/get/nonexistent_id");

      expect(res.status).toBe(200);
      expect(res.body.message).toBe("Category not found");
    });
  });

  describe("PUT /update/:id", () => {
    const updatedCategory = {
      ...mockCategory,
      name: "Updated Electronics",
    };

    it("should update an existing category", async () => {
      const mockCategoryInstance = {
        ...mockCategory,
        save: jest.fn().mockResolvedValueOnce(updatedCategory),
      };

      (Category.findById as jest.Mock).mockResolvedValueOnce(
        mockCategoryInstance
      );

      const res = await request(app)
        .put(`/category/update/${mockCategory._id}`)
        .send(updatedCategory);

      expect(res.status).toBe(200);
      expect(res.body.name).toBe(updatedCategory.name);
    });

    it("should return message when category not found", async () => {
      (Category.findById as jest.Mock).mockResolvedValueOnce(null);

      const res = await request(app)
        .put("/category/update/nonexistent_id")
        .send(updatedCategory);

      expect(res.status).toBe(200);
      expect(res.body.message).toBe("Category not found");
    });
  });

  describe("DELETE /delete/:id", () => {
    it("should delete an existing category", async () => {
      (Category.findById as jest.Mock).mockResolvedValueOnce(mockCategory);
      (Category.deleteOne as jest.Mock).mockResolvedValueOnce({
        acknowledged: true,
      });

      const res = await request(app).delete(
        `/category/delete/${mockCategory._id}`
      );

      expect(res.status).toBe(200);
      expect(res.body.message).toBe("Category deleted");
    });

    it("should return message when category not found", async () => {
      (Category.findById as jest.Mock).mockResolvedValueOnce(null);

      const res = await request(app).delete("/category/delete/nonexistent_id");

      expect(res.status).toBe(200);
      expect(res.body.message).toBe("Category not found");
    });
  });
});
