export interface UseOrderReturn {
  orders: IOrder[];
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

export interface CartItem {
  _id: string;
  name: string;
  price: number;
  quantity: number;
  imageUrl: string;
  countInStock: number;
}

export interface ShippingInfo {
  address: string;
  city: string;
  phoneNo: string;
  postalCode: string;
  country: string;
}

export interface PaymentIntent {
  id: string;
  status: string;
  amount: number;
}

export interface OrderProduct {
  product: string;
  name: string;
  quantity: number;
}

export interface IOrder {
  _id?: string;
  products: OrderProduct[];
  shippingInfo: ShippingInfo;
  orderStatus: string;
  paymentIntent: PaymentIntent;
  createdAt: string;
  totalAmount: number;
  user?: string;
}

export interface CreateOrderData {
  products: {
    product: string;

    quantity: number;
  }[];

  shippingInfo: ShippingInfo;

  paymentIntent: {
    id: string;

    status: string;

    amount: number;
  };
}
