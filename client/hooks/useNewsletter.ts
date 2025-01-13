import { useState, useCallback } from "react";
import {
  INewsletter,
  INewsletterPreferences,
  IPaginationData,
  INewsletterResponse,
} from "@/types";
import {
  subscribe,
  unsubscribe,
  getAllSubscribers,
  getSubscriberById,
  updateSubscriber,
  deleteSubscriber,
  bulkUpdateSubscribers,
} from "@/services";
import { toast } from "sonner";

interface UseNewsletterState {
  loading: boolean;
  error: string | null;
  subscribers: INewsletter[] | null;
  subscriber: INewsletter | null;
  paginationData: IPaginationData | null;
}

export const useNewsletter = () => {
  const [state, setState] = useState<UseNewsletterState>({
    loading: false,
    error: null,
    subscribers: null,
    subscriber: null,
    paginationData: null,
  });

  const updateState = useCallback((updates: Partial<UseNewsletterState>) => {
    setState((prev) => ({ ...prev, ...updates }));
  }, []);

  const handleError = useCallback(
    (error: unknown): INewsletterResponse => {
      const errorMessage =
        error instanceof Error ? error.message : "An unknown error occurred";
      updateState({ error: errorMessage });
      toast.error(errorMessage);
      return { success: false, message: errorMessage };
    },
    [updateState]
  );

  const handleUpdateSubscriber = useCallback(
    async (
      email: string,
      data: Partial<INewsletter>
    ): Promise<INewsletterResponse> => {
      updateState({ loading: true, error: null });
      try {
        const response = await updateSubscriber(email, data);
        if (response.success) {
          toast.success(response.message || "Subscriber updated successfully!");
          updateState({ subscriber: response.subscriber || null });
        }
        return response;
      } catch (err) {
        return handleError(err);
      } finally {
        updateState({ loading: false });
      }
    },
    [updateState, handleError]
  );

  const handleSubscribe = useCallback(
    async (
      email: string,
      preferences?: INewsletterPreferences
    ): Promise<INewsletterResponse> => {
      updateState({ loading: true, error: null });
      try {
        const response = await subscribe(email, preferences);

        // Handle the case where user exists but is unsubscribed
        if (!response.success && response.statusCode === 400) {
          const updateData = {
            subscribed: true,
            subscriptionStatus: "active" as const,
            preferences: preferences || undefined,
          };

          const updateResponse = await handleUpdateSubscriber(
            email,
            updateData
          );
          if (updateResponse.success) {
            toast.success("Subscription reactivated successfully!");
            updateState({ subscriber: updateResponse.subscriber || null });
          }
          return updateResponse;
        }

        if (response.success) {
          toast.success(response.message || "Subscribed successfully!");
          updateState({ subscriber: response.subscriber || null });
        }

        return response;
      } catch (err) {
        return handleError(err);
      } finally {
        updateState({ loading: false });
      }
    },
    [updateState, handleError, handleUpdateSubscriber]
  );

  const handleUnsubscribe = useCallback(
    async (email: string) => {
      updateState({ loading: true, error: null });
      try {
        const response = await unsubscribe(email);
        if (response.success) {
          toast.success(response.message || "Unsubscribed successfully!");
          // No need to update subscriber state as the record is deleted
          updateState({ subscriber: null });
        }
        return response;
      } catch (err) {
        return handleError(err);
      } finally {
        updateState({ loading: false });
      }
    },
    [updateState, handleError]
  );

  const fetchAllSubscribers = useCallback(async () => {
    updateState({ loading: true, error: null });
    try {
      const response = await getAllSubscribers();
      if (response.success) {
        updateState({
          subscribers: response.subscribers || null,
          paginationData: response.pagination || null,
        });
      }
      return response;
    } catch (err) {
      return handleError(err);
    } finally {
      updateState({ loading: false });
    }
  }, [updateState, handleError]);

  const fetchSubscriberById = useCallback(
    async (email: string) => {
      updateState({ loading: true, error: null });
      try {
        const response = await getSubscriberById(email);
        if (response.success && response.subscriber) {
          updateState({ subscriber: response.subscriber });
        } else {
          updateState({ subscriber: null });
        }
        return response;
      } catch (err) {
        if (
          !(
            err instanceof Error && err.message.includes("Subscriber not found")
          )
        ) {
          handleError(err);
        }
        updateState({ subscriber: null });
        return {
          success: false,
          subscriber: null,
          message: "Subscriber not found",
        };
      } finally {
        updateState({ loading: false });
      }
    },
    [updateState, handleError]
  );

  const handleDeleteSubscriber = useCallback(
    async (id: string) => {
      updateState({ loading: true, error: null });
      try {
        const response = await deleteSubscriber(id);
        if (response.success) {
          toast.success(response.message || "Subscriber deleted successfully!");
        }
        return response;
      } catch (err) {
        return handleError(err);
      } finally {
        updateState({ loading: false });
      }
    },
    [updateState, handleError]
  );

  const handleBulkUpdate = useCallback(
    async (updates: Partial<INewsletter>[]) => {
      updateState({ loading: true, error: null });
      try {
        const response = await bulkUpdateSubscribers(updates);
        if (response.success) {
          toast.success(
            response.message || "Subscribers updated successfully!"
          );
        }
        return response;
      } catch (err) {
        return handleError(err);
      } finally {
        updateState({ loading: false });
      }
    },
    [updateState, handleError]
  );

  return {
    ...state,
    handleSubscribe,
    handleUnsubscribe,
    fetchAllSubscribers,
    fetchSubscriberById,
    handleUpdateSubscriber,
    handleDeleteSubscriber,
    handleBulkUpdate,
  };
};
