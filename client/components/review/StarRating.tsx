import { Star } from "lucide-react";

interface StarRatingProps {
  rating: number;
  onRatingChange: (rating: number) => void;
}

export function StarRating({ rating, onRatingChange }: StarRatingProps) {
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => onRatingChange(star)}
          className="focus:outline-none"
        >
          <Star
            className={`h-6 w-6 ${
              star <= rating
                ? "fill-yellow-400 text-yellow-400"
                : "text-gray-300"
            } hover:fill-yellow-400 hover:text-yellow-400 transition-colors`}
          />
        </button>
      ))}
    </div>
  );
}
