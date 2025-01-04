export interface IOrder {
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
}
