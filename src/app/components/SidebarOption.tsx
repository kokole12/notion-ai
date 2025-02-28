"use client";
import { useDocumentData } from "react-firebase-hooks/firestore";
import { db } from "../../../firebase";
import { doc } from "firebase/firestore";
import { usePathname } from "next/navigation";
import Link from "next/link";

export default function SideBarOption({
  href,
  id,
}: {
  href: string;
  id: string;
}) {
  const [data, loading, error] = useDocumentData(doc(db, "documents", id));
  const pathName = usePathname();

  const isActive = href.includes(pathName) && pathName !== "/";

  if (!data) return null;
  return (
    <div>
      <Link
        href={href}
        className={`relative border rounded-md font-lg block transition-all text-center ${
          isActive
            ? "bg-gray-300 font-bold border-black text-black"
            : "border-gray-400 text-gray-600 hover:bg-gray-200 hover:border-gray-500"
        }`}
      >
        <p className="truncate font-sm">{data?.title}</p>
      </Link>
    </div>
  );
}
