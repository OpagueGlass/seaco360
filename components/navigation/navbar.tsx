"use client";

import { LayoutDashboardIcon, LogIn } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import * as React from "react";
import { AppSheet } from "./app-sheet";

import { useAuth } from "@/context/auth-context";
import { Button } from "../ui/button";

export function Navbar({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { session } = useAuth();
  const hideNavbar = pathname === "/login" || pathname === "/signup";

  if (hideNavbar) {
    return <main>{children}</main>;
  }

  return (
    <>
      <nav className="border-b bg-background/80 backdrop-blur-md sticky top-0 z-50">
        <div className=" px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 justify-between items-center">
            <div className="flex items-center gap-4">
              <AppSheet />
              <Link href="/" className="text-2xl font-bold">
                SEACO 360
              </Link>
              {/* <NavigationMenuDemo /> */}
            </div>
            {/* {!session ? (
              <Button className="flex items-center gap-2" asChild>
                <Link href="/login">
                  <LogIn /> 
                  Login
                </Link>
              </Button>
            ) : (
              <Button className="flex items-center gap-2" asChild>
                <Link href="/dashboard">
                  <LayoutDashboardIcon />
                  Dashboard
                </Link>
              </Button>
            )} */}
          </div>
        </div>
      </nav>
      <main className="from-muted/50 to-background h-full bg-gradient-to-b from-30%">{children}</main>
    </>
  );
}


