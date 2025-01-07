import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface ChatDialogProps {
  children: React.ReactNode;
}

export const ChatDialog = ({ children }: ChatDialogProps) => {
  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Chat with Admin</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 mt-4">
          <div className="bg-muted p-4 rounded-lg min-h-[300px]">
            <p className="text-muted-foreground text-center">
              Chat functionality coming soon...
            </p>
          </div>
          <div className="flex gap-2">
            <Input placeholder="Type your message..." disabled />
            <Button variant="secondary" disabled>
              Send
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
