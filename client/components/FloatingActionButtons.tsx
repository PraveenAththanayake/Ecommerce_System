import { Button } from "@/components/ui/button";
import { MessageSquare, Mail } from "lucide-react";
import { ChatDialog } from "./ChatDialog";
import { InquiryDialog } from "./InquiryDialog";

export const FloatingActionButtons = () => {
  return (
    <div className="fixed bottom-6 right-6 flex flex-col gap-4">
      <InquiryDialog>
        <Button
          size="icon"
          className="h-14 w-14 rounded-full shadow-lg hover:shadow-xl"
        >
          <Mail className="h-6 w-6" />
        </Button>
      </InquiryDialog>

      <ChatDialog>
        <Button
          size="icon"
          variant="secondary"
          className="h-14 w-14 rounded-full shadow-lg hover:shadow-xl"
        >
          <MessageSquare className="h-6 w-6" />
        </Button>
      </ChatDialog>
    </div>
  );
};
