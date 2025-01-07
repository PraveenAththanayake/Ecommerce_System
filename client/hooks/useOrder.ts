import { useState, useCallback } from "react";
import { toast } from "sonner";
import { IOrder } from "@/types";
import {
  createOrder,
  getUserOrders,
  updateOrder,
  updateOrderStatus,
  deleteOrder,
  getAllOrders,
  getOrder,
} from "@/services";

export const useOrder = () => {
  const [orders, setOrders] = useState<IOrder[] | null>(null);
  const [currentOrder, setCurrentOrder] = useState<IOrder | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const handleCreateOrder = useCallback(
    async (orderData: Omit<IOrder, "user">): Promise<IOrder> => {
      setLoading(true);
      setError(null);
      try {
        const response = await createOrder(orderData);
        const newOrder = response.order;

        setOrders((prevOrders) =>
          prevOrders ? [...prevOrders, newOrder] : [newOrder]
        );

        toast.success("Order created successfully");
        return newOrder;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to create order";
        setError(errorMessage);
        toast.error(errorMessage);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const handleGetOrders = useCallback(async (): Promise<IOrder[]> => {
    setLoading(true);
    setError(null);
    try {
      const response = await getAllOrders();
      const fetchedOrders = response.orders;
      setOrders(fetchedOrders);
      return fetchedOrders;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to fetch orders";
      setError(errorMessage);
      toast.error(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const handleGetOrderById = useCallback(
    async (id: string): Promise<IOrder> => {
      setLoading(true);
      setError(null);
      try {
        const response = await getOrder(id);
        const fetchedOrder = response.order;
        setCurrentOrder(fetchedOrder);
        return fetchedOrder;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to fetch order";
        setError(errorMessage);
        toast.error(errorMessage);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const handleGetUserOrders = useCallback(async (): Promise<IOrder[]> => {
    setLoading(true);
    setError(null);
    try {
      const response = await getUserOrders();
      const userOrders = response.orders;
      setOrders(userOrders);
      return userOrders;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to fetch user orders";
      setError(errorMessage);
      toast.error(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const handleUpdateOrder = useCallback(
    async (id: string, updateData: Partial<IOrder>): Promise<IOrder> => {
      setLoading(true);
      setError(null);
      try {
        const response = await updateOrder(id, updateData);
        const updatedOrder = response.order;

        setOrders((prevOrders) =>
          prevOrders
            ? prevOrders.map((order) =>
                order._id === id ? { ...order, ...updatedOrder } : order
              )
            : null
        );

        if (currentOrder?._id === id) {
          setCurrentOrder(updatedOrder);
        }

        toast.success("Order updated successfully");
        return updatedOrder;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to update order";
        setError(errorMessage);
        toast.error(errorMessage);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [currentOrder]
  );

  const handleUpdateOrderStatus = useCallback(
    async (id: string, orderStatus: IOrder["orderStatus"]): Promise<IOrder> => {
      setLoading(true);
      setError(null);
      try {
        const response = await updateOrderStatus(id, orderStatus);
        const updatedOrder = response.order;

        setOrders((prevOrders) =>
          prevOrders
            ? prevOrders.map((order) =>
                order._id === id
                  ? { ...order, orderStatus: updatedOrder.orderStatus }
                  : order
              )
            : null
        );

        if (currentOrder?._id === id) {
          setCurrentOrder(updatedOrder);
        }

        toast.success("Order status updated successfully");
        return updatedOrder;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to update order status";
        setError(errorMessage);
        toast.error(errorMessage);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [currentOrder]
  );

  const handleDeleteOrder = useCallback(
    async (id: string): Promise<void> => {
      setLoading(true);
      setError(null);
      try {
        await deleteOrder(id);

        setOrders((prevOrders) =>
          prevOrders ? prevOrders.filter((order) => order._id !== id) : null
        );

        if (currentOrder?._id === id) {
          setCurrentOrder(null);
        }

        toast.success("Order deleted successfully");
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to delete order";
        setError(errorMessage);
        toast.error(errorMessage);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [currentOrder]
  );

  return {
    orders,
    currentOrder,
    loading,
    error,
    handleCreateOrder,
    handleGetOrders,
    handleGetOrderById,
    handleGetUserOrders,
    handleUpdateOrder,
    handleUpdateOrderStatus,
    handleDeleteOrder,
    clearError,
    setCurrentOrder,
  };
};
