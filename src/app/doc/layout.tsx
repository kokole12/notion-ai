"use client";
import React from "react";
import LiveBlocksProvider from "../components/LiveblocksProvider";

export default function PageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <LiveBlocksProvider>{children}</LiveBlocksProvider>;
}
