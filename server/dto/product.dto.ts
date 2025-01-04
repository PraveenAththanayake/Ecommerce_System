export interface ProductDto {
  name: string;
  description: string;
  price: number;
  countInStock: number;
  category: string;
  slug: string;
  imageUrl: string;
  numReviews?: number;
  rating?: number;
}
