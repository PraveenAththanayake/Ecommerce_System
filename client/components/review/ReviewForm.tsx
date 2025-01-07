import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { UseFormReturn } from "react-hook-form";
import { ReviewFormData } from "@/types";
import { StarRating } from "./StarRating";

interface ReviewFormProps {
  form: UseFormReturn<ReviewFormData>;
  onSubmit: (data: ReviewFormData) => void;
  submitLabel: string;
  cancelButton?: React.ReactNode;
}

export function ReviewForm({
  form,
  onSubmit,
  submitLabel,
  cancelButton,
}: ReviewFormProps) {
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="rating"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Rating</FormLabel>
              <FormControl>
                <StarRating
                  rating={field.value}
                  onRatingChange={(value) => field.onChange(value)}
                />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="comment"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Your Review</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Share your thoughts about this product..."
                  className="resize-none"
                  {...field}
                />
              </FormControl>
            </FormItem>
          )}
        />
        <div className="flex justify-end gap-4">
          {cancelButton}
          <Button type="submit">{submitLabel}</Button>
        </div>
      </form>
    </Form>
  );
}
