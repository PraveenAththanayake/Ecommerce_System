export interface IProduct {
  name: string;
  description: string;
  price: number;
  countInStock: number;
  imageUrl: string;
  slug: string;
  category: string;
  numReviews?: number;
  rating?: number;
  id?: string;
}
