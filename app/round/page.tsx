"use client";

import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty";
import { Spinner } from "@/components/ui/spinner";
import { getHealthRoundYears } from "@/lib/query";
import { useQuery } from "@tanstack/react-query";
import { HeartPulse } from "lucide-react";
import Link from "next/link";

export default function HealthRoundsPage() {
  const { data: healthYears } = useQuery({
    queryKey: ["health-round-years"],
    queryFn: () => getHealthRoundYears(),
    staleTime: Infinity,
  });

  return (
    <div className="container mx-auto p-4 sm:p-6 space-y-6">
      <div className="space-y-2">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-2">
            <h1 className="text-3xl flex items-center font-bold">Health Rounds</h1>
            <p className="text-muted-foreground">Select a year to view health round data.</p>
          </div>
        </div>
      </div>

      {!healthYears ? (
        <div className="flex items-center justify-center w-full min-h-[40vh]">
          <Empty>
            <EmptyMedia>
              <Spinner className="size-12 text-primary" />
            </EmptyMedia>
            <EmptyHeader>
              <EmptyTitle>Loading</EmptyTitle>
              <EmptyDescription>Please wait while years are being loaded...</EmptyDescription>
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
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {healthYears.map((year) => (
            <Link key={year} href={`/round/${year}`}>
              <Card className="hover:bg-primary/10 transition-colors cursor-pointer h-full group">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="size-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 group-hover:bg-primary/20 transition-colors">
                      <HeartPulse className="size-5 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{year}</CardTitle>
                      <CardDescription>Health Round {year}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
