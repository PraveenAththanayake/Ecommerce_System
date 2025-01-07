export interface IReview {
  _id?: string;
  id?: string;
  product: string;
  name: string;
  rating: number;
  comment: string;
  user?: string;
  userName?: string;
  createdAt?: string;
}

export interface ReviewFormData {
  rating: number;
  comment: string;
}

export interface ReviewListProps {
  reviews: IReview[];

  onEditReview: (review: IReview) => void;

  onDeleteReview: (reviewId: string) => Promise<void>;
}
