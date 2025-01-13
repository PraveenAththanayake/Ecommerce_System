import { Request, Response, NextFunction } from "express";
import { Newsletter } from "../models";

export const Subscribe = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, preferences } = req.body;
    const user = req.user;

    if (!user) {
      res.status(403).json({
        success: false,
        message: "Not authorized to subscribe to newsletter",
      });
      return;
    }

    const existingSubscriber = await Newsletter.findOne({
      email,
      user: user._id,
    });

    if (existingSubscriber) {
      res.status(400).json({
        success: false,
        message: "You have already subscribed to newsletter",
      });
      return;
    }

    const newSubscriber = new Newsletter({
      email,
      user: user._id,
      subscribed: true,
      subscribedAt: new Date(),
      subscriptionStatus: "active",
      preferences,
    });

    await newSubscriber.save();

    res.status(201).json({
      success: true,
      message: "Successfully subscribed to newsletter",
      subscriber: newSubscriber,
    });
  } catch (error) {
    next(error);
  }
};

export const Unsubscribe = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email } = req.body;
    const user = req.user;

    if (!user) {
      res.status(403).json({
        success: false,
        message: "Not authorized to unsubscribe from newsletter",
      });
      return;
    }

    const subscription = await Newsletter.findOne({ email });

    if (!subscription) {
      res.status(404).json({
        success: false,
        message: "Subscription not found",
      });
      return;
    }

    // Delete the subscription instead of updating it
    await subscription.deleteOne();

    res.status(200).json({
      success: true,
      message: "Successfully unsubscribed from newsletter",
    });
    return;
  } catch (error) {
    next(error);
  }
};

export const GetAllSubscribers = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = req.user;

    if (!user) {
      res.status(403).json({
        success: false,
        message: "Not authorized to unsubscribe from newsletter",
      });
      return;
    }

    const subscribers = await Newsletter.find();

    res.status(200).json({
      success: true,
      subscribers,
    });
  } catch (error) {
    next(error);
  }
};

export const GetSubscriberById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email } = req.params;
    const user = req.user;

    if (!user) {
      res.status(403).json({
        success: false,
        message: "Not authorized to get subscriber details",
      });
      return;
    }

    const subscriber = await Newsletter.findOne({ email });

    if (!subscriber) {
      res.status(404).json({
        success: false,
        message: "Subscriber not found",
      });
      return;
    }

    res.status(200).json({
      success: true,
      subscriber,
    });
  } catch (error) {
    next(error);
  }
};

export const UpdateSubscriber = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email } = req.params;
    const { subscribed, subscriptionStatus, preferences } = req.body;
    const user = req.user;

    if (!user) {
      res.status(403).json({
        success: false,
        message: "Not authorized to update subscriber",
      });
      return;
    }

    const subscriber = await Newsletter.findOne({ email });

    if (!subscriber) {
      res.status(404).json({
        success: false,
        message: "Subscriber not found",
      });
      return;
    }

    subscriber.subscribed =
      subscribed !== undefined ? subscribed : subscriber.subscribed;
    subscriber.subscriptionStatus =
      subscriptionStatus || subscriber.subscriptionStatus;
    subscriber.preferences = preferences || subscriber.preferences;

    await subscriber.save();

    res.status(200).json({
      success: true,
      message: "Subscriber updated successfully",
      subscriber,
    });
  } catch (error) {
    next(error);
  }
};

export const DeleteSubscriber = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const user = req.user;

    if (!user) {
      res.status(403).json({
        success: false,
        message: "Not authorized to delete subscriber",
      });
      return;
    }

    const subscriber = await Newsletter.findById(id);

    if (!subscriber) {
      res.status(404).json({
        success: false,
        message: "Subscriber not found",
      });
      return;
    }

    await subscriber.deleteOne();

    res.status(200).json({
      success: true,
      message: "Subscriber deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

export const BulkUpdateSubscribers = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { updates } = req.body;
    const user = req.user;

    if (!user) {
      res.status(403).json({
        success: false,
        message: "Not authorized to update subscribers",
      });
      return;
    }

    const bulkOperations = updates.map((update: any) => ({
      updateOne: {
        filter: { _id: update.id },
        update: { $set: update.data },
      },
    }));

    const result = await Newsletter.bulkWrite(bulkOperations);

    res.status(200).json({
      success: true,
      message: "Bulk update successful",
      result,
    });
  } catch (error) {
    next(error);
  }
};
