"use client";

import { Navbar } from "@/components/navigation/navbar";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <Navbar>
      <main>{children}</main>
    </Navbar>
  );
}
