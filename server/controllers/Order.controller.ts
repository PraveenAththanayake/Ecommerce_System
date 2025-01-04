import { Request, Response, NextFunction } from "express";
import { Order } from "../models";
import { OrderDto } from "../dto";

// Create Order
export const CreateOrder = async (
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

    const orderData = <OrderDto>req.body;
    const newOrder = await Order.create({
      ...orderData,
      user: user._id,
    });

    const populatedOrder = await Order.findById(newOrder._id)
      .populate("user", "name email")
      .populate("products.product", "name price");

    res.status(201).json({
      success: true,
      order: populatedOrder,
    });
  } catch (error) {
    next(error);
  }
};

// Get All Orders
export const GetOrders = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const orders = await Order.find()
      .populate("user", "name email")
      .populate("products.product", "name price")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: orders.length,
      orders,
    });
  } catch (error) {
    next(error);
  }
};

// Get Single Order
export const GetOrder = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const order = await Order.findById(id)
      .populate("user", "name email")
      .populate("products.product", "name price");

    if (!order) {
      res.status(404).json({
        success: false,
        message: "Order not found",
      });
      return;
    }

    res.status(200).json({
      success: true,
      order,
    });
  } catch (error) {
    next(error);
  }
};

// Get User Orders
export const GetUserOrders = async (
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

    const orders = await Order.find({ user: user._id })
      .populate("products.product", "name price")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: orders.length,
      orders,
    });
  } catch (error) {
    next(error);
  }
};

// Update Order
export const UpdateOrder = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const order = await Order.findById(id);

    if (!order) {
      res.status(404).json({
        success: false,
        message: "Order not found",
      });
      return;
    }

    // Prevent updating completed or cancelled orders
    if (
      order.orderStatus === "Completed" ||
      order.orderStatus === "Cancelled"
    ) {
      res.status(400).json({
        success: false,
        message: `Cannot update order that is already ${order.orderStatus}`,
      });
      return;
    }

    // Update only allowed fields
    const updatedOrder = await Order.findByIdAndUpdate(
      id,
      {
        $set: {
          orderStatus: updateData.orderStatus,
          shippingInfo: updateData.shippingInfo,
        },
      },
      { new: true }
    )
      .populate("user", "name email")
      .populate("products.product", "name price");

    res.status(200).json({
      success: true,
      order: updatedOrder,
    });
  } catch (error) {
    next(error);
  }
};

// Update Order Status
export const UpdateOrderStatus = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const { orderStatus } = req.body;

    const validStatuses = [
      "Not Processed",
      "Processing",
      "Dispatched",
      "Cancelled",
      "Completed",
    ];

    if (!validStatuses.includes(orderStatus)) {
      res.status(400).json({
        success: false,
        message: "Invalid order status",
      });
      return;
    }

    const order = await Order.findById(id);

    if (!order) {
      res.status(404).json({
        success: false,
        message: "Order not found",
      });
      return;
    }

    // Prevent updating completed or cancelled orders
    if (
      order.orderStatus === "Completed" ||
      order.orderStatus === "Cancelled"
    ) {
      res.status(400).json({
        success: false,
        message: `Cannot update order that is already ${order.orderStatus}`,
      });
      return;
    }

    const updatedOrder = await Order.findByIdAndUpdate(
      id,
      { orderStatus },
      { new: true }
    )
      .populate("user", "name email")
      .populate("products.product", "name price");

    res.status(200).json({
      success: true,
      order: updatedOrder,
    });
  } catch (error) {
    next(error);
  }
};

// Delete Order
export const DeleteOrder = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const order = await Order.findById(id);

    if (!order) {
      res.status(404).json({
        success: false,
        message: "Order not found",
      });
      return;
    }

    // Prevent deleting completed or dispatched orders
    if (["Completed", "Dispatched"].includes(order.orderStatus)) {
      res.status(400).json({
        success: false,
        message: `Cannot delete ${order.orderStatus} order`,
      });
      return;
    }

    await Order.deleteOne({ _id: id });

    res.status(200).json({
      success: true,
      message: "Order deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};
