"use client";

import { useAuth } from "@/context/auth-context";
import { Button } from "@/components/ui/button";
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty";
import { Loader2, ShieldX } from "lucide-react";
import Link from "next/link";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { session, authState, signIn } = useAuth();

  if (authState.isLoading) {
    return (
      <div className="flex h-[80vh] w-full items-center justify-center">
        <Empty>
          <EmptyMedia>
            <Loader2 className="size-12 text-primary animate-spin" />
          </EmptyMedia>
          <EmptyHeader>
            <EmptyTitle>Loading</EmptyTitle>
            <EmptyDescription>Please wait while we verify your access...</EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <div className="flex justify-center gap-1">
              <span className="size-2 bg-primary/60 rounded-full animate-bounce [animation-delay:-0.3s]" />
              <span className="size-2 bg-primary/60 rounded-full animate-bounce [animation-delay:-0.15s]" />
              <span className="size-2 bg-primary/60 rounded-full animate-bounce" />
            </div>
          </EmptyContent>
        </Empty>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="flex h-[80vh] w-full items-center justify-center">
        <Empty>
          <EmptyMedia variant="icon" className="size-16 bg-destructive/10">
            <ShieldX className="size-8 text-destructive" />
          </EmptyMedia>
          <EmptyHeader>
            <EmptyTitle>Access Denied</EmptyTitle>
            <EmptyDescription>
              You don&apos;t have permission to view this page. Please sign in to continue.
            </EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <div className="flex flex-col sm:flex-row gap-2 justify-center w-full">
              <Button asChild variant="outline" className="w-full sm:w-auto">
                <Link href="/">Go Home</Link>
              </Button>
              <Button className="w-full sm:w-auto" onClick={signIn}>
                Sign In
              </Button>
            </div>
          </EmptyContent>
        </Empty>
      </div>
    );
  }

  return <>{children}</>;
}
