"use client";
import { MenuIcon } from "lucide-react";
import NewDocumentButton from "./NewDocumentButton";
import { useCollection } from "react-firebase-hooks/firestore";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useUser } from "@clerk/nextjs";
import {
  collectionGroup,
  DocumentData,
  query,
  where,
} from "firebase/firestore";
import { db } from "../../../firebase";
import { useEffect, useState } from "react";
import SideBarOption from "./SidebarOption";

interface RoomDocument extends DocumentData {
  createdAt: string;
  role: "owner" | "editor";
  roomId: string;
  userId: string;
}

export default function Sidebar() {
  const { user } = useUser();

  const [groupData, setGroupedData] = useState<{
    owner: RoomDocument[];
    editor: RoomDocument[];
  }>({ owner: [], editor: [] });

  const [data, loading, error] = useCollection(
    user &&
      query(
        collectionGroup(db, "rooms"),
        where("userId", "==", user?.emailAddresses[0].toString())
      )
  );

  useEffect(() => {
    if (!data) return;

    const grouped = data.docs.reduce<{
      owner: RoomDocument[];
      editor: RoomDocument[];
    }>(
      (acc, curr) => {
        const roomData = curr.data() as RoomDocument;
        if (roomData.role === "owner") {
          acc.owner.push({
            id: curr.id,
            ...roomData,
          });
        } else {
          acc.editor.push({
            id: curr.id,
            ...roomData,
          });
        }
        return acc;
      },
      { owner: [], editor: [] }
    );

    setGroupedData(grouped);
  }, [data]);

  const menuOptions = (
    <>
      <NewDocumentButton />

      {/** My Documents */}
      <div className="flex py-4 flex-col space-y-4 md:max-w-36">
        {groupData.owner.length === 0 ? (
          <h2>No document found</h2>
        ) : (
          <>
            <h2 className="text-gray-500 font-semibold text-sm">
              My Documents
            </h2>
            {groupData.owner.map((doc) => (
              <SideBarOption id={doc.id} href={`/doc/${doc.id}`} key={doc.id} />
            ))}
          </>
        )}
      </div>
      {/** List */}

      {/** Shared with me */}
      <div className="flex py-4 flex-col space-y-4 md:max-w-36">
        {groupData.editor.length > 0 ? (
          <>
            <h2 className="text-gray-500 font-semibold text-sm">
              Shared with me
            </h2>
            {groupData.editor.map((doc) => (
              <SideBarOption id={doc.id} href={`/doc/${doc.id}`} key={doc.id} />
            ))}
          </>
        ) : (
          <p></p>
        )}
      </div>
      {/** List */}
    </>
  );
  return (
    <div className="p-2 md:p-5 bg-gray-200 relative">
      <div className="md:hidden">
        <Sheet>
          <SheetTrigger>{<MenuIcon />}</SheetTrigger>
          <SheetContent side={"left"}>
            <SheetHeader>
              <SheetTitle>Menu</SheetTitle>
              <div>{menuOptions}</div>
            </SheetHeader>
          </SheetContent>
        </Sheet>
      </div>

      <div className="hidden md:inline">{menuOptions}</div>
    </div>
  );
}
