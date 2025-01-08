"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useInquiry } from "@/hooks/useInquiry";
import { toast } from "sonner";

interface InquiryDialogProps {
  children: React.ReactNode;
}

interface InquiryFormData {
  name: string;
  email: string;
  message: string;
}

export const InquiryDialog = ({ children }: InquiryDialogProps) => {
  const [open, setOpen] = useState(false);
  const { createNewInquiry, loading } = useInquiry();
  const [formData, setFormData] = useState<InquiryFormData>({
    name: "",
    email: "",
    message: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await createNewInquiry({
        name: formData.name,
        email: formData.email,
        inquiry: formData.message,
      });

      setFormData({ name: "", email: "", message: "" });
      setOpen(false);

      toast("Success", {
        description: "Your inquiry has been sent successfully.",
      });
    } catch {
      toast("Error", {
        description: "Failed to send inquiry. Please try again.",
      });
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const isFormValid = formData.name && formData.email && formData.message;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Send an Inquiry</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Input
              name="name"
              placeholder="Your Name"
              value={formData.name}
              onChange={handleInputChange}
              required
              disabled={loading}
              className="w-full"
            />
          </div>
          <div className="space-y-2">
            <Input
              type="email"
              name="email"
              placeholder="Your Email"
              value={formData.email}
              onChange={handleInputChange}
              required
              disabled={loading}
              className="w-full"
            />
          </div>
          <div className="space-y-2">
            <Textarea
              name="message"
              placeholder="Your Message"
              value={formData.message}
              onChange={handleInputChange}
              className="min-h-[100px] w-full"
              required
              disabled={loading}
            />
          </div>
          <Button
            type="submit"
            className="w-full"
            disabled={loading || !isFormValid}
          >
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Send Inquiry
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};
