"use client";

import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Loader2, Trash2, PencilIcon, Mail } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useInquiry } from "@/hooks/useInquiry";
import { toast } from "sonner";
import { IInquiry } from "@/types";

export default function InquiryNotifications() {
  const {
    inquiries,
    loading,
    error,
    fetchInquiries,
    updateExistingInquiry,
    deleteExistingInquiry,
  } = useInquiry();

  const [selectedInquiry, setSelectedInquiry] = useState<IInquiry | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [editForm, setEditForm] = useState({
    name: "",
    email: "",
    inquiry: "",
  });

  useEffect(() => {
    fetchInquiries();
  }, []);

  const handleEdit = (inquiry: IInquiry) => {
    setSelectedInquiry(inquiry);
    setEditForm({
      name: inquiry.name,
      email: inquiry.email,
      inquiry: inquiry.inquiry,
    });
    setEditMode(true);
  };

  const handleUpdate = async () => {
    if (!selectedInquiry) return;

    try {
      if (selectedInquiry._id) {
        await updateExistingInquiry(selectedInquiry._id, editForm);
      } else {
        toast.error("Inquiry ID is missing");
      }
      setEditMode(false);
      setSelectedInquiry(null);
      toast.success("Inquiry updated successfully");
      fetchInquiries();
    } catch {
      toast.error("Failed to update inquiry");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteExistingInquiry(id);
      toast.success("Inquiry deleted successfully");
      fetchInquiries();
    } catch {
      toast.error("Failed to delete inquiry");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen text-red-500">
        Error: {error}
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-16 mt-12 lg:mt-20">
      <Card>
        <CardHeader>
          <CardTitle>Inquiries</CardTitle>
          <CardDescription>
            Manage and view all your inquiries here
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Message</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {inquiries.map((inquiry) => (
                <TableRow key={inquiry._id}>
                  <TableCell>{inquiry.name}</TableCell>
                  <TableCell>{inquiry.email}</TableCell>
                  <TableCell className="max-w-md truncate">
                    {inquiry.inquiry}
                  </TableCell>
                  <TableCell>
                    {inquiry.createdAt
                      ? new Date(inquiry.createdAt).toLocaleString()
                      : "N/A"}
                  </TableCell>
                  <TableCell className="space-x-2">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => setSelectedInquiry(inquiry)}
                        >
                          <Mail className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Inquiry Details</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div>
                            <h3 className="font-semibold">From</h3>
                            <p>
                              {inquiry.name} ({inquiry.email})
                            </p>
                          </div>
                          <div>
                            <h3 className="font-semibold">Message</h3>
                            <p className="whitespace-pre-wrap">
                              {inquiry.inquiry}
                            </p>
                          </div>
                          <div>
                            <h3 className="font-semibold">Sent</h3>
                            <p>
                              {inquiry.createdAt
                                ? new Date(inquiry.createdAt).toLocaleString()
                                : "N/A"}
                            </p>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>

                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleEdit(inquiry)}
                    >
                      <PencilIcon className="h-4 w-4" />
                    </Button>

                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => inquiry._id && handleDelete(inquiry._id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={editMode} onOpenChange={setEditMode}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Inquiry</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Input
                placeholder="Name"
                value={editForm.name}
                onChange={(e) =>
                  setEditForm({ ...editForm, name: e.target.value })
                }
              />
            </div>
            <div>
              <Input
                type="email"
                placeholder="Email"
                value={editForm.email}
                onChange={(e) =>
                  setEditForm({ ...editForm, email: e.target.value })
                }
              />
            </div>
            <div>
              <Textarea
                placeholder="Message"
                value={editForm.inquiry}
                onChange={(e) =>
                  setEditForm({ ...editForm, inquiry: e.target.value })
                }
                className="min-h-[100px]"
              />
            </div>
            <div className="flex justify-end space-x-2">
              <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
              </DialogClose>
              <Button onClick={handleUpdate}>Update</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
