"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CountingNumber } from "@/components/ui/counting-number";
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty";
import { Spinner } from "@/components/ui/spinner";
import { getHealthRoundYears } from "@/lib/query";
import { ScrollArea } from "@radix-ui/react-scroll-area";
import { useQuery } from "@tanstack/react-query";
import { ArrowRight, BarChart4, Calendar, Users } from "lucide-react";
import Link from "next/link";

export default function HealthRoundsPage() {
  const { data: healthYears, isLoading } = useQuery({
    queryKey: ["health-round-years"],
    queryFn: () => getHealthRoundYears(),
    staleTime: Infinity,
  });

  return (
    <ScrollArea>
    <div className="min-h-screen bg-muted/30">
      <div className="relative overflow-hidden border-b bg-gradient-to-br from-primary/5 via-background to-secondary/5">
        <div className="container mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="text-balance mb-6 text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
              Health Rounds
            </h1>
            <p className="text-pretty mx-auto max-w-2xl text-lg leading-relaxed text-muted-foreground sm:text-xl">
              Explore comprehensive statistics on health conditions, chronic diseases and quality of life metrics across
              five subdistricts in Segamat
            </p>
            <div className="mt-12 grid grid-cols-3 gap-6 sm:gap-8">
              <div className="space-y-1">
                <div className="flex items-center justify-center gap-2">
                  <Calendar className="size-5 text-primary" />
                  <CountingNumber number={healthYears?.length || 0} className="text-2xl font-bold sm:text-3xl" />
                </div>
                <p className="text-sm text-muted-foreground">Years Available</p>
              </div>
              <div className="space-y-1">
                <div className="flex items-center justify-center gap-2">
                  <Users className="size-5 text-primary" />
                  <CountingNumber number={24000} suffix={"+"} className="text-2xl font-bold sm:text-3xl" />
                </div>
                <p className="text-sm text-muted-foreground">Participants</p>
              </div>
              <div className="space-y-1">
                <div className="flex items-center justify-center gap-2">
                  <BarChart4 className="size-5 text-primary" />
                  <CountingNumber number={20} suffix={"+"} className="text-2xl font-bold sm:text-3xl" />
                </div>
                <p className="text-sm text-muted-foreground">Health Metrics</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto max-w-7xl px-4 pt-8 sm:pt-6 sm:pt-12">
        <div className="mb-4 sm:mb-8">
          <h2 className="text-balance mb-3 text-2xl font-bold tracking-tight sm:text-3xl">Select a Year</h2>
          <p className="text-pretty text-muted-foreground">
            Choose from available years to view health round statistics
          </p>
        </div>

        {isLoading ? (
          <div className="flex min-h-[40vh] items-center justify-center">
            <Empty>
              <EmptyMedia>
                <Spinner className="size-12 text-primary" />
              </EmptyMedia>
              <EmptyHeader>
                <EmptyTitle>Loading Available Years</EmptyTitle>
                <EmptyDescription>Fetching health round data, please wait...</EmptyDescription>
              </EmptyHeader>
            </Empty>
          </div>
        ) : (
          <div className="space-y-4 pb-16">
            {healthYears?.map((year, index) => (
              <Link
                key={year}
                href={`/round/${year}`}
                className="group relative block overflow-hidden rounded-xl border bg-card transition-all duration-300 hover:border-primary/20 hover:shadow-sm"
              >
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-primary to-transparent opacity-0 transition-opacity duration-200 group-hover:opacity-40" />
                <div className="relative flex items-center justify-between gap-6 p-6">
                  <div className="flex items-center gap-6">
                    <div className="flex size-16 shrink-0 items-center justify-center rounded-xl border-2 bg-muted/50 transition-colors duration-200 group-hover:border-primary/20 group-hover:bg-primary/5">
                      <Calendar className="size-8 text-primary transition-transform duration-300 group-hover:scale-110" />
                    </div>
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-3">
                        <h2 className="text-3xl font-bold tracking-tight">{year}</h2>
                        {index === 0 && (
                          <Badge
                            variant="secondary"
                            className="text-xs transition-colors duration-200 group-hover:bg-primary/10 group-hover:text-primary"
                          >
                            Latest
                          </Badge>
                        )}
                      </div>
                      {index === healthYears.length - 1 ? (
                        <p className="text-sm leading-relaxed text-muted-foreground">
                          Core health data and key indicators
                        </p>
                      ) : (
                        <p className="text-sm leading-relaxed text-muted-foreground">
                          Expanded data with extra health insights
                        </p>
                      )}
                    </div>
                  </div>

                  <Button
                    variant="secondary"
                    size="icon"
                    className="shrink-0 transition-transform duration-200 group-hover:translate-x-1 cursor-pointer"
                  >
                    <ArrowRight className="size-5" />
                    <span className="sr-only">View {year}</span>
                  </Button>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
    </ScrollArea>
  );
}
