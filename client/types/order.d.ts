export interface IOrder {
  _id?: string;
  products: [
    {
      product: string;
      quantity: number;
    }
  ];
  user: string;
  shippingInfo: {
    address: string;
    city: string;
    phoneNo: string;
    postalCode: string;
    country: string;
  };
  paymentIntent: string;
  orderStatus:
    | "Not Processed"
    | "Processing"
    | "Dispatched"
    | "Cancelled"
    | "Completed";
  createdAt?: string;
  totalAmount: number;
  items: {
    productId: string;
    productName: string;
    quantity: number;
    price: number;
  }[];
}

export interface UseOrderReturn {
  orders: IOrder[] | null;
  currentOrder: IOrder | null;
  loading: boolean;
  error: string | null;
  handleCreateOrder: (orderData: IOrder) => Promise<IOrder>;
  handleGetOrders: () => Promise<IOrder[]>;
  handleGetOrderById: (id: string) => Promise<IOrder>;
  handleGetUserOrders: () => Promise<IOrder[]>;
  handleUpdateOrder: (
    id: string,
    updateData: Partial<IOrder>
  ) => Promise<IOrder>;
  handleUpdateOrderStatus: (id: string, orderStatus: string) => Promise<IOrder>;
  handleDeleteOrder: (id: string) => Promise<void>;
  clearError: () => void;
  setCurrentOrder: (order: IOrder | null) => void;
}
