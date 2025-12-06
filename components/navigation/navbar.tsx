"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { AppSheet } from "./app-sheet";

export function Navbar({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const hideNavbar = pathname === "/login" || pathname === "/signup";

  if (hideNavbar) {
    return <main>{children}</main>;
  }
  
  return (
    <>
      <nav className="border-b bg-background/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16">
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
