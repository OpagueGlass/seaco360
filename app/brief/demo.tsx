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

/**
 * Bar chart showing census response data
 *
 * @param data - Object containing counts for each census response category
 */
function CensusResponseBarChart({
  data,
}: {
  data: { agreed: number; refused: number; notAtHome: number; unoccupied: number };
}) {
  const { agreed, refused, notAtHome, unoccupied } = data;

  const chartData = [
    { category: "Agreed", count: agreed, fill: "var(--color-agreed)" },
    { category: "Refused", count: refused, fill: "var(--color-refused)" },
    { category: "Not at Home", count: notAtHome, fill: "var(--color-notAtHome)" },
    { category: "Unoccupied", count: unoccupied, fill: "var(--color-unoccupied)" },
  ];

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
          <BarChart accessibilityLayer data={chartData} layout="vertical" margin={{ left: 20 }}>
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

/**
 * Bar chart showing ethnic composition
 * 
 * @param data - Object containing proportions for each ethnic category
 */
function EthnicCompositionBarChart({
  data,
}: {
  data: { malay: number; chinese: number; indian: number; orangAsli: number };
}) {
  const { malay, chinese, indian, orangAsli } = data;

  const chartData = [
    { category: "Malay", proportion: malay, fill: "var(--color-malay)" },
    { category: "Chinese", proportion: chinese, fill: "var(--color-chinese)" },
    { category: "Indian", proportion: indian, fill: "var(--color-indian)" },
    { category: "Orang Asli", proportion: orangAsli, fill: "var(--color-orangAsli)" },
  ];

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
          <BarChart accessibilityLayer data={chartData} height={250}>
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

/**
 * Pie chart showing gender proportions
 * 
 * @param data - Object containing gender proportions
 */
function GenderPieChart({ data }: { data: { male: number; female: number } }) {
  const { male, female } = data;

  const chartData = [
    { category: "male", proportion: male, fill: "var(--color-male)" },
    { category: "female", proportion: female, fill: "var(--color-female)" },
  ];

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

/**
 * Pie chart showing senior population proportions
 * 
 * @param data - Object containing proportions for senior and non-senior population
 */
function SeniorPopulationPieChart({ data }: { data: { senior: number; nonSenior: number } }) {
  const { senior, nonSenior } = data;

  const chartData = [
    { category: "senior", proportion: senior, fill: "var(--color-senior)" },
    { category: "nonSenior", proportion: nonSenior, fill: "var(--color-nonSenior)" },
  ];

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
              data={chartData}
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
        <CensusResponseBarChart data={censusResponseData} />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <EthnicCompositionBarChart data={ethnicData} />
        <GenderPieChart data={genderData} />
        <SeniorPopulationPieChart data={seniorData} />
      </div>
    </div>
  );
}
