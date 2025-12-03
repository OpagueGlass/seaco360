import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { PercentageTooltipFormatter } from "@/components/ui/TooltipFormatter";
import { censusResponseData, ethnicData, genderData, seniorData } from "@/lib/mockData";
import { Bar, BarChart, CartesianGrid, Pie, PieChart, XAxis, YAxis } from "recharts";

function CensusResponseBarChart({
  censusResponseData,
}: {
  censusResponseData: { category: string; count: number; fill: string }[];
}) {
  const chartConfig = {
    count: {
      label: "Count",
    },
    agreed: {
      label: "Agreed",
      color: "var(--chart-1)",
    },
    refused: {
      label: "Refused",
      color: "var(--chart-2)",
    },
    notAtHome: {
      label: "Not at Home",
      color: "var(--chart-3)",
    },
    unoccupied: {
      label: "Unoccupied",
      color: "var(--chart-4)",
    },
  } satisfies ChartConfig;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Census Response</CardTitle>
        <CardDescription>Household response rates during census collection</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="min-h-[200px] max-h-[500px] w-full">
          <BarChart accessibilityLayer data={censusResponseData} layout="vertical" margin={{ left: 20 }}>
            <CartesianGrid horizontal={false} strokeDasharray="3 3" className="stroke-muted" />
            <YAxis dataKey="category" type="category" tickLine={false} tickMargin={10} axisLine={false} />
            <XAxis dataKey="count" type="number" tickLine={false} axisLine={false} />
            <ChartTooltip content={<ChartTooltipContent hideLabel nameKey="category" />} />
            <Bar dataKey="count" name="Count" layout="vertical" radius={[0, 5, 5, 0]} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

function EthnicCompositionBarChart({
  ethnicData,
}: {
  ethnicData: { category: string; proportion: number; fill: string }[];
}) {
  const chartConfig = {
    malay: {
      label: "Malay",
      color: "var(--chart-1)",
    },
    chinese: {
      label: "Chinese",
      color: "var(--chart-2)",
    },
    indian: {
      label: "Indian",
      color: "var(--chart-3)",
    },
    orangAsli: {
      label: "Orang Asli",
      color: "var(--chart-4)",
    },
  } satisfies ChartConfig;

  return (
    <Card className="flex flex-col h-full">
      <CardHeader>
        <CardTitle>Ethnic Composition</CardTitle>
        <CardDescription>Population breakdown by ethnicity</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col">
        <ChartContainer config={chartConfig} className="max-h-[250px] h-full">
          <BarChart accessibilityLayer data={ethnicData} height={250}>
            <XAxis dataKey="category" tickLine={false} tickMargin={10} axisLine={false} />
            <YAxis tickLine={false} axisLine={false} hide />
            <ChartTooltip content={<ChartTooltipContent formatter={PercentageTooltipFormatter(chartConfig)} />} />
            <Bar dataKey="proportion" name="Composition" layout="vertical" radius={[5, 5, 0, 0]} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

function GenderPieChart({ genderData }: { genderData: { category: string; proportion: number; fill: string }[] }) {
  const chartConfig = {
    male: {
      label: "Male",
      color: "var(--chart-1)",
    },
    female: {
      label: "Female",
      color: "var(--chart-2)",
    },
  } satisfies ChartConfig;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Gender Distribution</CardTitle>
        <CardDescription>Population breakdown by gender</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="mx-auto aspect-square max-h-[250px]">
          <PieChart>
            <Pie data={genderData} dataKey="proportion" nameKey="category" />
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

function SeniorPopulationPieChart({
  seniorData,
}: {
  seniorData: { category: string; proportion: number; fill: string }[];
}) {
  const chartConfig = {
    senior: {
      label: "Senior",
      color: "var(--chart-3)",
    },
    nonSenior: {
      label: "Non-Senior",
      color: "var(--chart-4)",
    },
  } satisfies ChartConfig;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Senior Population</CardTitle>
        <CardDescription>Population aged 60 and above</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="mx-auto aspect-square max-h-[250px]">
          <PieChart>
            <Pie
              data={seniorData}
              dataKey="proportion"
              nameKey="category"
              innerRadius={60}
              outerRadius={100}
              strokeWidth={2}
              stroke="var(--color-background)"
            />
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

export default function DemoComponent() {
  return (
    <div>
      <div className="mb-8">
        <CensusResponseBarChart censusResponseData={censusResponseData} />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <EthnicCompositionBarChart ethnicData={ethnicData} />
        <GenderPieChart genderData={genderData} />
        <SeniorPopulationPieChart seniorData={seniorData} />
      </div>
    </div>
  );
}
