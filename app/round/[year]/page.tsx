"use client";

import { Button } from "@/components/ui/button";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { getHealthRoundData } from "@/lib/query";
import { SummaryData } from "@/lib/summarise";
import { cn } from "@/lib/utils";
import { CircleAlert, HeartPulse,  MapPin, ShieldX } from "lucide-react";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import HealthRoundCharts from "./hr-tabs";
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty";
import Link from "next/link";

export const subdistricts = [
  { name: "Overall", key: "overall" },
  { name: "Bekok", key: "bekok" },
  { name: "Chaah", key: "chaah" },
  { name: "Gemereh", key: "gemereh" },
  { name: "Jabi", key: "jabi" },
  { name: "Sungai Segamat", key: "sgSegamat" },
] as const;

export default function HealthRoundYearPage() {
  const params = useParams();
  const year = params.year as string;
  const [index, setIndex] = useState(0);
  const selectedSubdistrict = subdistricts[index];
  const [healthData, setHealthData] = useState<SummaryData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      const data = await getHealthRoundData(parseInt(year, 10));
      setHealthData(data);
      if (!data) {
        setError("Failed to load health round data.");
      }
    }
    fetchData();
  }, [year]);
  
  if (error) {
    return (
      <div className="flex h-[80vh] w-full items-center justify-center">
        <Empty>
          <EmptyMedia variant="icon" className="size-16 bg-destructive/10">
            {/* <ShieldX className="size-8 text-destructive" /> */}
            <CircleAlert className="size-8 text-destructive" />
          </EmptyMedia>
          <EmptyHeader>
            <EmptyTitle>Year {year} Not Found</EmptyTitle>
            <EmptyDescription>
              The health round data for {year} could not be found. Please check the year and try again.
            </EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <div className="flex flex-col sm:flex-row gap-2 justify-center w-full">
              <Button asChild variant="outline" className="w-full sm:w-auto">
                <Link href="/">Go Home</Link>
              </Button>
              <Button asChild className="w-full sm:w-auto">
                <Link href="/round">Back to Health Rounds</Link>
              </Button>
            </div>
          </EmptyContent>
        </Empty>
      </div>
    );
  }

  return (
    <div className="flex flex-col xl:flex-row">
      <aside className="w-full xl:w-64 border-b xl:border-b-0 xl:border-r bg-background xl:fixed xl:left-0 xl:top-0 xl:h-screen xl:overflow-y-auto xl:mt-16">
        <div className="p-6">
          <h2 className="text-lg font-semibold flex items-center gap-2 mb-6 pb-3 border-b">
            <MapPin className="size-5 text-primary" />
            Subdistricts
          </h2>
          <ScrollArea className="h-auto xl:h-[calc(100vh-220px)]">
            <div className="flex flex-row xl:flex-col gap-2">
              {subdistricts.map((subdistrict, idx) => (
                <Button
                  key={subdistrict.key}
                  variant={selectedSubdistrict.key === subdistrict.key ? "default" : "ghost"}
                  className={cn(
                    "justify-start w-auto xl:w-full h-11 font-medium transition-all",
                    selectedSubdistrict.key === subdistrict.key
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "hover:bg-muted/80"
                  )}
                  onClick={() => setIndex(idx)}
                >
                  <div className="flex items-center gap-2 w-full">
                    <div
                      className={cn(
                        "size-1.5 rounded-full transition-colors",
                        index === idx ? "bg-primary-foreground" : "bg-muted-foreground/30"
                      )}
                    />
                    <span className="truncate">{subdistrict.name}</span>
                  </div>
                </Button>
              ))}
            </div>
            <ScrollBar orientation="horizontal" className="sticky bottom-0 hidden" />
          </ScrollArea>
        </div>
      </aside>

      <main className="flex-1 p-6 sm:p-8 lg:p-10 xl:ml-64">
        <div className="max-w-7xl mx-auto space-y-8">
          <div className="space-y-3">
            <h1 className="text-3xl sm:text-4xl font-bold flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <HeartPulse className="size-7 sm:size-8 text-primary" />
              </div>
              Health Round {year}
            </h1>
            <div className="flex items-center gap-2 text-base">
              <MapPin className="size-4 text-muted-foreground" />
              <p className="text-muted-foreground">
                Showing data for <span className="font-semibold text-foreground">{selectedSubdistrict.name}</span>
                {index === 0 && (
                  <span className="ml-2 text-xs bg-primary/10 text-primary px-2.5 py-1 rounded-full font-medium">
                    All Subdistricts
                  </span>
                )}
              </p>
            </div>
          </div>
          <HealthRoundCharts data={healthData} subdistrict={selectedSubdistrict.key} />
        </div>
      </main>
    </div>
  );
}
