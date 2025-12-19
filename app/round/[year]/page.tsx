"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { PercentageTooltipFormatter } from "@/components/ui/TooltipFormatter";
import { Bar, BarChart, CartesianGrid, Cell, Pie, PieChart, XAxis, YAxis } from "recharts";
import { MapPin, HeartPulse } from "lucide-react";
import { cn } from "@/lib/utils";

// Subdistricts
const subdistricts = ["Overall", "Bekok", "Chaah", "Gemereh", "Jabi", "Sungai Segamat"];

// Mock data for each subdistrict
const mockData: Record<string, {
  sex: { male: number; female: number };
  ethnicity: { malay: number; chinese: number; indian: number; orangAsli: number };
  education: { none: number; primary: number; secondary: number; tertiary: number };
  ageGroup: { child: number; youth: number; adult: number; senior: number };
}> = {
  Overall: {
    sex: { male: 48.5, female: 51.5 },
    ethnicity: { malay: 55, chinese: 25, indian: 12, orangAsli: 8 },
    education: { none: 8, primary: 25, secondary: 45, tertiary: 22 },
    ageGroup: { child: 18, youth: 22, adult: 42, senior: 18 },
  },
  Bekok: {
    sex: { male: 49, female: 51 },
    ethnicity: { malay: 60, chinese: 20, indian: 10, orangAsli: 10 },
    education: { none: 10, primary: 28, secondary: 42, tertiary: 20 },
    ageGroup: { child: 20, youth: 20, adult: 40, senior: 20 },
  },
  Chaah: {
    sex: { male: 47, female: 53 },
    ethnicity: { malay: 50, chinese: 30, indian: 15, orangAsli: 5 },
    education: { none: 6, primary: 22, secondary: 48, tertiary: 24 },
    ageGroup: { child: 16, youth: 24, adult: 44, senior: 16 },
  },
  Gemereh: {
    sex: { male: 50, female: 50 },
    ethnicity: { malay: 58, chinese: 22, indian: 12, orangAsli: 8 },
    education: { none: 9, primary: 26, secondary: 44, tertiary: 21 },
    ageGroup: { child: 19, youth: 21, adult: 41, senior: 19 },
  },
  Jabi: {
    sex: { male: 48, female: 52 },
    ethnicity: { malay: 52, chinese: 28, indian: 14, orangAsli: 6 },
    education: { none: 7, primary: 24, secondary: 46, tertiary: 23 },
    ageGroup: { child: 17, youth: 23, adult: 43, senior: 17 },
  },
  "Sungai Segamat": {
    sex: { male: 49.5, female: 50.5 },
    ethnicity: { malay: 54, chinese: 26, indian: 11, orangAsli: 9 },
    education: { none: 8, primary: 25, secondary: 45, tertiary: 22 },
    ageGroup: { child: 18, youth: 22, adult: 42, senior: 18 },
  },
};

// Chart components
function SexPieChart({ data }: { data: { male: number; female: number } }) {
  const chartData = [
    { category: "male", proportion: data.male, fill: "var(--color-male)" },
    { category: "female", proportion: data.female, fill: "var(--color-female)" },
  ];

  const chartConfig = {
    male: { label: "Male", color: "var(--chart-1)" },
    female: { label: "Female", color: "var(--chart-2)" },
  } satisfies ChartConfig;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Sex Distribution</CardTitle>
        <CardDescription>Population by gender</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="mx-auto aspect-square max-h-[250px]">
          <PieChart>
            <Pie data={chartData} dataKey="proportion" nameKey="category" />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel formatter={PercentageTooltipFormatter(chartConfig)} />}
            />
            <ChartLegend content={<ChartLegendContent />} />
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

function EthnicityBarChart({
  data,
}: {
  data: { malay: number; chinese: number; indian: number; orangAsli: number };
}) {
  const chartData = [
    { category: "Malay", proportion: data.malay, fill: "var(--color-malay)" },
    { category: "Chinese", proportion: data.chinese, fill: "var(--color-chinese)" },
    { category: "Indian", proportion: data.indian, fill: "var(--color-indian)" },
    { category: "Orang Asli", proportion: data.orangAsli, fill: "var(--color-orangAsli)" },
  ];

  const chartConfig = {
    malay: { label: "Malay", color: "var(--chart-1)" },
    chinese: { label: "Chinese", color: "var(--chart-2)" },
    indian: { label: "Indian", color: "var(--chart-3)" },
    orangAsli: { label: "Orang Asli", color: "var(--chart-4)" },
  } satisfies ChartConfig;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Ethnicity</CardTitle>
        <CardDescription>Population by ethnic group</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="max-h-[250px] w-full">
          <BarChart data={chartData}>
            <CartesianGrid vertical={false} strokeDasharray="3 3" className="stroke-muted" />
            <XAxis dataKey="category" tickLine={false} tickMargin={10} axisLine={false} />
            <YAxis tickLine={false} axisLine={false} width={30} />
            <ChartTooltip content={<ChartTooltipContent formatter={PercentageTooltipFormatter(chartConfig)} />} />
            <Bar dataKey="proportion" radius={[5, 5, 0, 0]} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

function EducationBarChart({
  data,
}: {
  data: { none: number; primary: number; secondary: number; tertiary: number };
}) {
  const chartData = [
    { category: "None", proportion: data.none, fill: "var(--color-none)" },
    { category: "Primary", proportion: data.primary, fill: "var(--color-primary)" },
    { category: "Secondary", proportion: data.secondary, fill: "var(--color-secondary)" },
    { category: "Tertiary", proportion: data.tertiary, fill: "var(--color-tertiary)" },
  ];

  const chartConfig = {
    none: { label: "None", color: "var(--chart-1)" },
    primary: { label: "Primary", color: "var(--chart-2)" },
    secondary: { label: "Secondary", color: "var(--chart-3)" },
    tertiary: { label: "Tertiary", color: "var(--chart-4)" },
  } satisfies ChartConfig;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Education Level</CardTitle>
        <CardDescription>Highest education attained</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="max-h-[250px] w-full">
          <BarChart data={chartData}>
            <CartesianGrid vertical={false} strokeDasharray="3 3" className="stroke-muted" />
            <XAxis dataKey="category" tickLine={false} tickMargin={10} axisLine={false} />
            <YAxis tickLine={false} axisLine={false} width={30} />
            <ChartTooltip content={<ChartTooltipContent formatter={PercentageTooltipFormatter(chartConfig)} />} />
            <Bar dataKey="proportion" radius={[5, 5, 0, 0]} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

function AgeGroupPieChart({
  data,
}: {
  data: { child: number; youth: number; adult: number; senior: number };
}) {
  const chartData = [
    { category: "child", proportion: data.child, fill: "var(--color-child)" },
    { category: "youth", proportion: data.youth, fill: "var(--color-youth)" },
    { category: "adult", proportion: data.adult, fill: "var(--color-adult)" },
    { category: "senior", proportion: data.senior, fill: "var(--color-senior)" },
  ];

  const chartConfig = {
    child: { label: "Child (0-14)", color: "var(--chart-1)" },
    youth: { label: "Youth (15-24)", color: "var(--chart-2)" },
    adult: { label: "Adult (25-59)", color: "var(--chart-3)" },
    senior: { label: "Senior (60+)", color: "var(--chart-4)" },
  } satisfies ChartConfig;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Age Group</CardTitle>
        <CardDescription>Population by age category</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="mx-auto aspect-square max-h-[250px]">
          <PieChart>
            <Pie data={chartData} dataKey="proportion" nameKey="category" />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel formatter={PercentageTooltipFormatter(chartConfig)} />}
            />
            <ChartLegend content={<ChartLegendContent />} />
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

export default function HealthRoundYearPage() {
  const params = useParams();
  const year = params.year as string;
  const [selectedSubdistrict, setSelectedSubdistrict] = useState("Overall");

  const data = mockData[selectedSubdistrict];

  return (
    <div className="flex flex-col lg:flex-row min-h-screen">
      {/* Sidebar */}
      <aside className="w-full lg:w-64 border-b lg:border-b-0 lg:border-r bg-background">
        <div className="p-6">
          <h2 className="text-lg font-semibold flex items-center gap-2 mb-6 pb-3 border-b">
            <MapPin className="size-5 text-primary" />
            Subdistricts
          </h2>
          <ScrollArea className="h-auto lg:h-[calc(100vh-220px)]">
            <div className="flex flex-row lg:flex-col gap-2">
              {subdistricts.map((subdistrict) => (
                <Button
                  key={subdistrict}
                  variant={selectedSubdistrict === subdistrict ? "default" : "ghost"}
                  className={cn(
                    "justify-start w-auto lg:w-full h-11 font-medium transition-all",
                    selectedSubdistrict === subdistrict 
                      ? "bg-primary text-primary-foreground shadow-sm" 
                      : "hover:bg-muted/80"
                  )}
                  onClick={() => setSelectedSubdistrict(subdistrict)}
                >
                  <div className="flex items-center gap-2 w-full">
                    <div className={cn(
                      "size-1.5 rounded-full transition-colors",
                      selectedSubdistrict === subdistrict 
                        ? "bg-primary-foreground" 
                        : "bg-muted-foreground/30"
                    )} />
                    <span className="truncate">{subdistrict}</span>
                  </div>
                </Button>
              ))}
            </div>
          </ScrollArea>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 sm:p-8 lg:p-10">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Header */}
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
                Showing data for{" "}
                <span className="font-semibold text-foreground">{selectedSubdistrict}</span>
                {selectedSubdistrict === "Overall" && (
                  <span className="ml-2 text-xs bg-primary/10 text-primary px-2.5 py-1 rounded-full font-medium">
                    All Subdistricts
                  </span>
                )}
              </p>
            </div>
          </div>

          {/* Charts Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <SexPieChart data={data.sex} />
            <EthnicityBarChart data={data.ethnicity} />
            <EducationBarChart data={data.education} />
            <AgeGroupPieChart data={data.ageGroup} />
          </div>
        </div>
      </main>
    </div>
  );
}
