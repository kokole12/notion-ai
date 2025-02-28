"use client";

import {
  SignedIn,
  SignedOut,
  SignInButton,
  UserButton,
  useUser,
} from "@clerk/nextjs";
import BreadCrumbs from "./BreadCrumbs";

export default function Header() {
  const { user } = useUser();

  return (
    <div className="flex items-center justify-between bg-gray-200 px-2 py-3">
      {user && (
        <h1 className="text-xl font-bold">
          {user.firstName} {`'s`} Space
        </h1>
      )}

      {/**bread cramps */}
      <BreadCrumbs />

      <SignedOut>
        <SignInButton />
      </SignedOut>

      <SignedIn>
        <UserButton />
      </SignedIn>
    </div>
  );
}
