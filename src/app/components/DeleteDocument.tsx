"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { DialogClose } from "@radix-ui/react-dialog";
import { usePathname, useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { deleteDocument } from "../../../actions/actions";
import { toast } from "sonner";

export default function DeleteDocument() {
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const pathName = usePathname();
  const router = useRouter();

  async function handleDelete() {
    const roomId = pathName.split("/").pop();
    if (!roomId) return;
    startTransition(async () => {
      const { success } = await deleteDocument(roomId);

      if (success) {
        setIsOpen(false);
        router.replace("/");
        //toast.success
        toast.success("Room delete successfully");
      } else {
        toast.error("failed to delete room");
      }
    });
  }
  return (
    <div>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <Button asChild variant={"destructive"}>
          <DialogTrigger>Delete</DialogTrigger>
        </Button>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Are you sure you want to delete?</DialogTitle>
            <DialogDescription>
              This will permanently delete the document and remove all the users
              of this file
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="sm:justify-end">
            <Button
              type="button"
              onClick={handleDelete}
              disabled={isPending}
              variant={"destructive"}
            >
              {isPending ? "Deleting..." : "Confirm"}
            </Button>
            <DialogClose asChild>
              <Button variant={"secondary"} type="button">
                Close
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
