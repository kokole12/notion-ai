"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { usePathname } from "next/navigation";
import { FormEvent, useState, useTransition } from "react";
import { inviteCollaboratorToRoom } from "../../../actions/actions";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";

export default function InviteUser() {
  const [email, setEmail] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const pathName = usePathname();

  async function handleInvite(e: FormEvent) {
    e.preventDefault();

    const roomId = pathName.split("/").pop();
    if (!roomId) return;
    startTransition(async () => {
      const { success } = await inviteCollaboratorToRoom(roomId, email);

      if (success) {
        setIsOpen(false);
        setEmail("");
        //toast.success
        toast.success("Collaboarator added successfully");
      } else {
        toast.error("failed to add Collaborator");
      }
    });
  }

  return (
    <div>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <Button asChild variant={"outline"}>
          <DialogTrigger>Invite</DialogTrigger>
        </Button>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Invite Collaborator</DialogTitle>
            <DialogDescription>
              Enter the Email of the Collaborator
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleInvite} className="flex gap-2">
            <Input
              type="email"
              placeholder="Email..."
              className="w-full"
              value={email}
            />
            <Button type="submit" disabled={!email || isPending}>
              {isPending ? "Inviting..." : "Invite"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
