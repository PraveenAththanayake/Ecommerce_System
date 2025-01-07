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
    const { name, email, inquiry } = req.body;
    const user = req.user;

    if (!user) {
      res.status(401).json({ message: "User not authenticated" });
      return;
    }

    const createInquiry = await Inquiry.create({
      name,
      email,
      inquiry,
      user,
    });

    res.status(201).json(createInquiry);
  } catch (error) {
    console.error("Create Inquiry Error:", error);
    res.status(500).json({
      message: "Error creating inquiry",
      error: error instanceof Error ? error.message : String(error),
    });
  }
};

// Get All Inquiries function
export const GetInquiries = async (
  req: Request,
  res: Response
): Promise<void> => {
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
    console.error("Get Inquiries Error:", error);
    res.status(500).json({
      message: "Error fetching inquiries",
      error: error instanceof Error ? error.message : String(error),
    });
  }
};

// Get Inquiry by ID function
export const GetInquiryById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const inquiry = await Inquiry.findById(id).populate("user", "name email");

    if (inquiry) {
      res.json(inquiry);
    } else {
      res.status(404).json({ message: "Inquiry not found" });
    }
  } catch (error) {
    console.error("Get Inquiry By Id Error:", error);
    res.status(500).json({
      message: "Error fetching inquiry",
      error: error instanceof Error ? error.message : String(error),
    });
  }
};

// Update Inquiry function
export const UpdateInquiry = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const { name, email, inquiry } = req.body;
    const user = req.user;

    // Check if inquiry exists
    const inquiryMessage = await Inquiry.findById(id);

    if (!inquiryMessage) {
      res.status(404).json({ message: "Inquiry not found" });
      return;
    }

    // Type guard for user
    if (
      !user ||
      !user._id ||
      inquiryMessage.user.toString() !== user._id.toString()
    ) {
      res
        .status(403)
        .json({ message: "Not authorized to update this inquiry" });
      return;
    }

    // Update the inquiry
    const updatedInquiry = await Inquiry.findByIdAndUpdate(
      id,
      { name, email, inquiry },
      { new: true, runValidators: true }
    );

    if (updatedInquiry) {
      res.json(updatedInquiry);
    } else {
      res.status(404).json({ message: "Inquiry not found" });
    }
  } catch (error) {
    console.error("Update Inquiry Error:", error);
    res.status(500).json({
      message: "Error updating inquiry",
      error: error instanceof Error ? error.message : String(error),
    });
  }
};

// Delete Inquiry function
export const DeleteInquiry = async (
  req: Request,
  res: Response
): Promise<void> => {
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
    console.error("Delete Inquiry Error:", error);
    res.status(500).json({
      message: "Error deleting inquiry",
      error: error instanceof Error ? error.message : String(error),
    });
  }
};
