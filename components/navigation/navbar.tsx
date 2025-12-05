"use client";

import Link from "next/link";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AppSheet } from "./app-sheet";

export function Navbar({ children }: { children: React.ReactNode }) {
  return (
    <>
      <nav className="border-b bg-background sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <AppSheet />
              <Link href="/" className="text-2xl font-bold">
                SEACO 360
              </Link>
            </div>
          </div>
        </div>
      </nav>
      <main>{children}</main>
    </>
  );
}
