import { Request, Response } from "express";
import { Inquiry } from "../models";
import { InquiryDto } from "../dto";

// Helper function to find inquiry
export const FindInquiry = async (id: string | undefined, email?: string) => {
  if (email) {
    return await Inquiry.findOne({ email: email });
  } else {
    return await Inquiry.findById(id);
  }
};

// Create Inquiry function
export const CreateInquiry = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { name, email, inquiry } = <InquiryDto>req.body;
    const user = req.user?._id;

    const createInquiry = await Inquiry.create({
      name,
      email,
      inquiry,
      user,
    });

    res.status(201).json(createInquiry);
  } catch (error) {
    res.status(500).json({ message: "Error creating inquiry", error });
  }
};

// Get All Inquiries function
export const GetInquiries = async (req: Request, res: Response) => {
  try {
    const inquiries = await Inquiry.find()
      .populate("user", "name email")
      .sort({ createdAt: -1 });

    if (inquiries.length > 0) {
      res.json(inquiries);
    } else {
      res.json({ message: "No inquiries found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error fetching inquiries", error });
  }
};

// Get Inquiry by ID function
export const GetInquiryById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const inquiry = await Inquiry.findById(id).populate("user", "name email");

    if (inquiry) {
      res.json(inquiry);
    } else {
      res.status(404).json({ message: "Inquiry not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error fetching inquiry", error });
  }
};

// Update Inquiry function
export const UpdateInquiry = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, email, inquiry } = <InquiryDto>req.body;

    const existingInquiry = await FindInquiry(id);

    if (existingInquiry) {
      existingInquiry.name = name;
      existingInquiry.email = email;
      existingInquiry.inquiry = inquiry;

      await existingInquiry.save();
      res.json(existingInquiry);
    } else {
      res.status(404).json({ message: "Inquiry not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error updating inquiry", error });
  }
};

// Delete Inquiry function
export const DeleteInquiry = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const inquiry = await FindInquiry(id);

    if (inquiry) {
      await Inquiry.deleteOne({ _id: id });
      res.json({ message: "Inquiry deleted successfully" });
    } else {
      res.status(404).json({ message: "Inquiry not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error deleting inquiry", error });
  }
};
