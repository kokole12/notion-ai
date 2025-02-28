"use client";
import React from "react";
import {
  ClientSideSuspense,
  RoomProvider as RoomProviderwrapper,
} from "@liveblocks/react/suspense";
import LoadingSpinner from "./LoadingSpinner";
import LiveCursorProvider from "./LiveCursorProvider";
export default function RoomProvider({
  roomId,
  children,
}: {
  roomId: string;
  children: React.ReactNode;
}) {
  return (
    <RoomProviderwrapper id={roomId} initialPresence={{ cursor: null }}>
      <ClientSideSuspense fallback={<LoadingSpinner />}>
        <LiveCursorProvider>{children}</LiveCursorProvider>
      </ClientSideSuspense>
    </RoomProviderwrapper>
  );
}
