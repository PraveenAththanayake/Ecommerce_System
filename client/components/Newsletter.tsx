import { useState, useEffect } from "react";
import { Mail, ArrowRight, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useNewsletter } from "@/hooks/useNewsletter";
import { useUser } from "@/hooks/useUser";
import { toast } from "sonner";
import { INewsletter } from "@/types";

const NewsletterSection = () => {
  const [subscriberData, setSubscriberData] = useState<INewsletter | null>(
    null
  );
  const { user, loading: userLoading } = useUser();
  const {
    loading: newsletterLoading,
    handleSubscribe,
    handleUnsubscribe,
    fetchSubscriberById,
  } = useNewsletter();

  useEffect(() => {
    const fetchSubscriptionStatus = async () => {
      if (!user?.email) {
        setSubscriberData(null);
        return;
      }

      try {
        const response = await fetchSubscriberById(user.email);
        if (response?.success && response.subscriber) {
          setSubscriberData(response.subscriber);
        } else {
          setSubscriberData(null);
        }
      } catch (error) {
        console.error("Failed to fetch subscription status:", error);
        setSubscriberData(null);
      }
    };

    fetchSubscriptionStatus();
  }, [user, fetchSubscriberById]);

  const toggleSubscription = async () => {
    if (!user?.email) {
      toast.error("Please sign in to subscribe.");
      return;
    }

    try {
      if (subscriberData?.subscribed) {
        const response = await handleUnsubscribe(user.email);
        if (response?.success) {
          // Clear subscriber data immediately after successful unsubscribe
          setSubscriberData(null);
          toast.success("Successfully unsubscribed from newsletter");
        }
      } else {
        const response = await handleSubscribe(user.email, {
          frequency: "weekly",
          categories: ["all"],
        });

        if (response?.success && response.subscriber) {
          setSubscriberData(response.subscriber);
        }
      }
    } catch (error) {
      console.error("Subscription toggle failed:", error);
      toast.error("Failed to update subscription");
    }
  };

  const isLoading = userLoading || newsletterLoading;
  const isSubscribed = subscriberData?.subscribed || false;

  return (
    <section className="py-12 bg-background relative overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <div className="absolute -left-4 top-1/4 w-24 h-24 bg-primary/10 rounded-full blur-2xl" />
        <div className="absolute -right-4 top-3/4 w-32 h-32 bg-primary/10 rounded-full blur-2xl" />
      </div>

      <div className="max-w-7xl mx-auto px-4">
        <Card className="border bg-background/60 backdrop-blur-xl">
          <div className="grid lg:grid-cols-2 gap-8 p-8">
            <div className="space-y-6">
              <Badge variant="secondary">📫 Stay Updated</Badge>
              <h2 className="text-3xl font-bold">
                Subscribe to Our
                <span className="text-primary block mt-1">Newsletter</span>
              </h2>
              <p className="text-muted-foreground max-w-[600px]">
                Join our community of fashion enthusiasts and get exclusive
                offers, early access to new collections, and style tips
                delivered straight to your inbox.
              </p>
              <div className="flex gap-2 flex-wrap">
                {[
                  "Exclusive Offers",
                  "New Arrivals",
                  "Style Tips",
                  subscriberData?.preferences?.frequency &&
                    `${subscriberData.preferences.frequency
                      .charAt(0)
                      .toUpperCase()}${subscriberData.preferences.frequency.slice(
                      1
                    )} Updates`,
                ]
                  .filter(Boolean)
                  .map((benefit) => (
                    <Badge key={benefit} variant="outline">
                      {benefit}
                    </Badge>
                  ))}
              </div>

              <div className="pt-4">
                {user ? (
                  <div>
                    <Button
                      onClick={toggleSubscription}
                      disabled={isLoading}
                      variant={isSubscribed ? "destructive" : "default"}
                    >
                      {isLoading
                        ? "Processing..."
                        : isSubscribed
                        ? "Unsubscribe"
                        : "Subscribe"}
                      {isSubscribed ? (
                        <XCircle className="ml-2 h-4 w-4" />
                      ) : (
                        <ArrowRight className="ml-2 h-4 w-4" />
                      )}
                    </Button>
                    <p className="text-sm mt-2 text-muted-foreground">
                      {isSubscribed
                        ? `Subscribed with ${user.email} - ${
                            subscriberData?.preferences?.frequency || "weekly"
                          } updates`
                        : "Subscribe with your account email"}
                    </p>
                  </div>
                ) : (
                  <p className="text-muted-foreground">
                    Please sign in to subscribe to the newsletter.
                  </p>
                )}
              </div>
            </div>
            <div className="hidden lg:block">
              <div className="relative h-full flex items-center justify-center">
                <div className="text-center">
                  <Mail className="w-16 h-16 mx-auto text-primary" />
                  <p className="text-xl font-semibold mt-4">
                    Join 50k+ Subscribers
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Get {subscriberData?.preferences?.frequency || "weekly"}{" "}
                    updates directly to your inbox.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </section>
  );
};

export default NewsletterSection;
