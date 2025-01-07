import { useState, useCallback } from "react";
import { IOrder } from "@/types";
import {
  createOrder,
  getAllOrders,
  getOrder,
  getUserOrders,
  updateOrder,
  updateOrderStatus,
  deleteOrder,
} from "@/services";

interface OrderState {
  orders: IOrder[];
  currentOrder: IOrder | null;
  loading: boolean;
  error: string | null;
  count: number;
}

interface UseOrderReturn extends OrderState {
  createNewOrder: (orderData: Omit<IOrder, "user">) => Promise<void>;
  fetchAllOrders: () => Promise<void>;
  fetchOrder: (orderId: string) => Promise<void>;
  fetchUserOrders: () => Promise<void>;
  updateOrderDetails: (
    orderId: string,
    updateData: Partial<IOrder>
  ) => Promise<void>;
  updateStatus: (
    orderId: string,
    status: IOrder["orderStatus"]
  ) => Promise<void>;
  removeOrder: (orderId: string) => Promise<void>;
  resetState: () => void;
}

export const useOrder = (): UseOrderReturn => {
  const [state, setState] = useState<OrderState>({
    orders: [],
    currentOrder: null,
    loading: false,
    error: null,
    count: 0,
  });

  const setLoading = (loading: boolean) => {
    setState((prev) => ({ ...prev, loading, error: null }));
  };

  const setError = (error: string) => {
    setState((prev) => ({ ...prev, loading: false, error }));
  };

  const resetState = useCallback(() => {
    setState({
      orders: [],
      currentOrder: null,
      loading: false,
      error: null,
      count: 0,
    });
  }, []);

  const createNewOrder = useCallback(
    async (orderData: Omit<IOrder, "user">) => {
      setLoading(true);
      try {
        const response = await createOrder(orderData);
        setState((prev) => ({
          ...prev,
          currentOrder: response.order,
          loading: false,
        }));
      } catch (error) {
        setError(
          error instanceof Error ? error.message : "Failed to create order"
        );
      }
    },
    []
  );

  const fetchAllOrders = useCallback(async () => {
    setLoading(true);
    try {
      const response = await getAllOrders();
      setState((prev) => ({
        ...prev,
        orders: response.orders,
        count: response.count,
        loading: false,
      }));
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Failed to fetch orders"
      );
    }
  }, []);

  const fetchOrder = useCallback(async (orderId: string) => {
    setLoading(true);
    try {
      const response = await getOrder(orderId);
      setState((prev) => ({
        ...prev,
        currentOrder: response.order,
        loading: false,
      }));
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Failed to fetch order"
      );
    }
  }, []);

  const fetchUserOrders = useCallback(async () => {
    setLoading(true);
    try {
      const response = await getUserOrders();
      setState((prev) => ({
        ...prev,
        orders: response.orders,
        count: response.count,
        loading: false,
      }));
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Failed to fetch user orders"
      );
    }
  }, []);

  const updateOrderDetails = useCallback(
    async (orderId: string, updateData: Partial<IOrder>) => {
      setLoading(true);
      try {
        const response = await updateOrder(orderId, updateData);
        setState((prev) => ({
          ...prev,
          currentOrder: response.order,
          orders: prev.orders.map((order) =>
            order._id === orderId ? response.order : order
          ),
          loading: false,
        }));
      } catch (error) {
        setError(
          error instanceof Error ? error.message : "Failed to update order"
        );
      }
    },
    []
  );

  const updateStatus = useCallback(
    async (orderId: string, status: IOrder["orderStatus"]) => {
      setLoading(true);
      try {
        const response = await updateOrderStatus(orderId, status);
        setState((prev) => ({
          ...prev,
          currentOrder: response.order,
          orders: prev.orders.map((order) =>
            order._id === orderId ? response.order : order
          ),
          loading: false,
        }));
      } catch (error) {
        setError(
          error instanceof Error
            ? error.message
            : "Failed to update order status"
        );
      }
    },
    []
  );

  const removeOrder = useCallback(async (orderId: string) => {
    setLoading(true);
    try {
      await deleteOrder(orderId);
      setState((prev) => ({
        ...prev,
        orders: prev.orders.filter((order) => order._id !== orderId),
        currentOrder:
          prev.currentOrder?._id === orderId ? null : prev.currentOrder,
        count: prev.count - 1,
        loading: false,
      }));
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Failed to delete order"
      );
    }
  }, []);

  return {
    ...state,
    createNewOrder,
    fetchAllOrders,
    fetchOrder,
    fetchUserOrders,
    updateOrderDetails,
    updateStatus,
    removeOrder,
    resetState,
  };
};
