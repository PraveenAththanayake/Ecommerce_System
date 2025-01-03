export interface OrderDto {
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
  paymentIntent: any;
  orderStatus:
    | "Not Processed"
    | "Processing"
    | "Dispatched"
    | "Cancelled"
    | "Completed";
}
