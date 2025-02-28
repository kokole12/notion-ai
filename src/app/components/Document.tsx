"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { doc, updateDoc } from "firebase/firestore";
import { FormEvent, useEffect, useState, useTransition } from "react";
import { db } from "../../../firebase";
import { useDocumentData } from "react-firebase-hooks/firestore";
import Editor from "./Editor";
import useOwner from "@/lib/useOwner";
import DeleteDocument from "./DeleteDocument";
import InviteUser from "./InviteUser";
import ManageUsers from "./ManageUsers";
import Avatars from "./Avatars";

export default function Document({ id }: { id: string }) {
  const [data, loading, error] = useDocumentData(doc(db, "documents", id));
  const [input, setInput] = useState("");
  const [isUpdating, startTransition] = useTransition();
  const isOwner = useOwner();

  const MAX_TITLE_LENGTH = 100;
  const TITLE_REGEX = /^[a-zA-Z0-9\s\-_]+$/;

  useEffect(() => {
    if (data) {
      setInput(data?.title ?? "");
    }
  }, [data]);

  const updateTitle = (e: FormEvent) => {
    e.preventDefault();
    const trimmedInput = input.trim();
    if (!trimmedInput) {
      return;
    }
    if (trimmedInput.length > MAX_TITLE_LENGTH) {
      alert(`Title must be less than ${MAX_TITLE_LENGTH} characters`);
      return;
    }
    if (!TITLE_REGEX.test(trimmedInput)) {
      alert(
        "Title can only contain letters, numbers, spaces, hyphens and underscores"
      );
      return;
    }
    startTransition(async () => {
      await updateDoc(doc(db, "documents", id), { title: trimmedInput });
    });
  };

  return (
    <div className="flex-1 h-full bg-white p-5">
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          Error loading document: {error.message}
        </div>
      )}
      {loading ? (
        <div className="flex justify-center items-center h-24">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
        </div>
      ) : (
        <div className="flex max-w-6xl mx-auto justify-between pb-5">
          <form onSubmit={updateTitle} className="flex flex-1 space-x-2">
            {/** update title */}
            <Input
              placeholder=""
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
            <Button disabled={isUpdating} type={"submit"}>
              {isUpdating ? "Updating..." : "Update"}
            </Button>
            {/** If OWNER */}
            {isOwner && (
              <>
                {/** Invite user */}
                <InviteUser />
                {/** Delete document */}
                <DeleteDocument />
              </>
            )}
          </form>
        </div>
      )}
      <div className="flex max-w-6xl justify-between items-center">
        {/** manage users */}
        <ManageUsers />
        {/** Avatars */}
        <Avatars />
      </div>
      <hr className="pb-10" />
      {/** collaborative editor */}
      <Editor />
    </div>
  );
}
