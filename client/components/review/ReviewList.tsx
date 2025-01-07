import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Star, Pencil, Trash2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { IReview } from "@/types";

interface ReviewListProps {
  reviews: IReview[];
  currentUserId?: string;
  onEdit: (review: IReview) => void;
  onDelete: (reviewId: string) => void;
}

export default function ReviewList({
  reviews,
  currentUserId,
  onEdit,
  onDelete,
}: ReviewListProps) {
  // Helper function to safely get user ID from review
  const getReviewUserId = (review: IReview) => {
    if (typeof review.user === "string") {
      return review.user;
    }
    // If review.user is an object with _id
    if (
      review.user &&
      typeof review.user === "object" &&
      "_id" in review.user
    ) {
      return (review.user as { _id: string })._id;
    }
    return null;
  };

  if (reviews.length === 0) {
    return (
      <p className="text-center text-muted-foreground py-12">
        No reviews yet. Be the first to review this product!
      </p>
    );
  }

  return (
    <div className="space-y-6">
      {reviews.map((review) => (
        <Card key={review._id}>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="font-semibold">{review.name}</p>
                <div className="flex items-center gap-2">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${
                          i < review.rating
                            ? "fill-yellow-400 text-yellow-400"
                            : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {new Date(review.createdAt || "").toLocaleDateString()}
                  </p>
                </div>
              </div>

              {currentUserId && currentUserId === getReviewUserId(review) && (
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onEdit(review)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete Review</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to delete your review? This
                          action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                          onClick={() => review._id && onDelete(review._id)}
                        >
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              )}
            </div>
            <p className="text-muted-foreground">{review.comment}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
