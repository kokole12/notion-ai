"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { createNewDocument } from "../../../actions/actions";

export default function NewDocumentButton() {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  function handleCreateDocument() {
    startTransition(async () => {
      const docId = await createNewDocument();
      router.push(`/doc/${docId}`);
    });
  }

  return (
    <Button onClick={handleCreateDocument} disabled={isPending}>
      {isPending ? "Creating..." : "New Document"}
    </Button>
  );
}
