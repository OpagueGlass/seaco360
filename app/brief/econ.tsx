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
import { employmentData, householdData, topIndustriesData, internetTvData, vehicleData } from "@/lib/mockData";
import { colourIndex } from "@/lib/utils";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Pie,
  PieChart,
  Scatter,
  ScatterChart,
  Tooltip,
  XAxis,
  YAxis,
  ZAxis,
} from "recharts";

/**
 * Bar chart showing employment status proportions
 * 
 * @param data - Object containing proportions for each employment status category
 */
function EmploymentStatusBarChart({
  data,
}: {
  data: { employed: number; unemployed: number; student: number; retired: number; homemaker: number };
}) {
  const { employed, unemployed, student, retired, homemaker } = data;

  const chartData = [
    { category: "Employed", proportion: employed, fill: "var(--color-employed)" },
    { category: "Unemployed", proportion: unemployed, fill: "var(--color-unemployed)" },
    { category: "Student", proportion: student, fill: "var(--color-student)" },
    { category: "Retired", proportion: retired, fill: "var(--color-retired)" },
    { category: "Homemaker", proportion: homemaker, fill: "var(--color-homemaker)" },
  ];

  const chartConfig = {
    proportion: {
      label: "Proportion",
    },
    employed: {
      label: "Employed",
      color: "var(--chart-1)",
    },
    unemployed: {
      label: "Unemployed",
      color: "var(--chart-2)",
    },
    student: {
      label: "Student",
      color: "var(--chart-3)",
    },
    retired: {
      label: "Retired",
      color: "var(--chart-4)",
    },
    homemaker: {
      label: "Homemaker",
      color: "var(--chart-5)",
    },
  } satisfies ChartConfig;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Employment Status</CardTitle>
        <CardDescription>Population breakdown by employment status</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="min-h-[200px] max-h-[500px] w-full h-full">
          <BarChart accessibilityLayer data={chartData} margin={{ left: 0 }}>
            <CartesianGrid vertical={false} strokeDasharray="3 3" className="stroke-muted" />
            <XAxis dataKey="category" type="category" tickLine={false} tickMargin={10} axisLine={false} />
            <YAxis dataKey="proportion" type="number" tickLine={false} axisLine={false} width={24} />
            <ChartTooltip content={<ChartTooltipContent formatter={PercentageTooltipFormatter(chartConfig)} />} />
            <Bar dataKey="proportion" name="Composition" radius={[5, 5, 0, 0]} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

/**
 * Bubble chart showing top 5 industries by employee proportion
 * 
 * @param data - Array of objects containing the top 5 industry categories and proportion
 */
function TopIndustriesBubbleChart({
  data,
}: {
  data: {category: string; proportion: number}[]
}) {
  const chartData = data.map(colourIndex);

  const chartConfig = {
    name: {
      label: "Industry",
    },
  } satisfies ChartConfig;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Top 5 Industries by Employee Count</CardTitle>
        <CardDescription>Major employment sectors</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="min-h-[200px] max-h-[500px] w-full h-full">
          <ScatterChart>
            <XAxis type="number" dataKey="x" hide domain={[0, chartData.length + 1]} />
            <YAxis type="number" dataKey="y" hide domain={[0, 2]} />
            <ZAxis type="number" dataKey="z" range={[0, 1000]} />
            <Tooltip
              cursor={{ strokeDasharray: "3 3" }}
              content={({ payload }) => {
                if (payload && payload.length) {
                  return (
                    <div className="rounded-lg border bg-popover px-1.5 py-1 shadow-sm">
                      <div className="flex items-center gap-0.5">
                        <div
                          className="h-2.5 w-2.5 shrink-0 rounded-[2px] border mr-1"
                          style={{ backgroundColor: payload[0].payload?.fill }}
                        />
                        <span className="text-muted-foreground self-center mb-0.5 mr-2">
                          {payload[0].payload.category}
                        </span>
                        <span className="ml-auto text-foreground font-mono font-semibold tabular-nums self-center">
                          {payload[0].payload.proportion}
                        </span>
                        <span className="text-muted-foreground font-normal font-mono font-semibold tabular-nums self-center ml-auto">
                          %
                        </span>
                      </div>
                    </div>
                  );
                }
                return null;
              }}
            />
            {chartData.map((entry, index) => (
              <Scatter
                name={entry.category}
                data={[{ ...entry, x: index + 1, y: 1, z: entry.proportion }]}
                key={index}
                fill={entry.fill}
              />
            ))}
            <Legend />
          </ScatterChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

/**
 * Bar chart showing household types proportions
 * 
 * @param data - Object containing proportions for each household type category
 */
function HouseHoldTypesBarChart({
  data,
}: {
  data: { nuclearFamily: number; extendedFamily: number; otherTypesOfSharing: number };
}) {
  const { nuclearFamily, extendedFamily, otherTypesOfSharing } = data;

  const chartData = [
    { category: "Nuclear family", proportion: nuclearFamily, fill: "var(--color-nuclearFamily)" },
    { category: "Extended family", proportion: extendedFamily, fill: "var(--color-extendedFamily)" },
    { category: "Other types of sharing", proportion: otherTypesOfSharing, fill: "var(--color-other)" },
  ];

  const chartConfig = {
    nuclearFamily: {
      label: "Nuclear family",
      color: "var(--chart-1)",
    },
    extendedFamily: {
      label: "Extended family",
      color: "var(--chart-2)",
    },
    other: {
      label: "Other types of sharing",
      color: "var(--chart-3)",
    },
  } satisfies ChartConfig;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Household Types</CardTitle>
        <CardDescription>Distribution of household compositions</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="min-h-[200px] max-h-[250px] w-full h-full">
          <BarChart accessibilityLayer data={chartData} layout="vertical" margin={{ left: 20 }}>
            <YAxis dataKey="category" type="category" tickLine={false} tickMargin={10} axisLine={false} />
            <XAxis dataKey="proportion" type="number" tickLine={false} axisLine={false} hide />
            <ChartTooltip
              content={
                <ChartTooltipContent hideLabel nameKey="category" formatter={PercentageTooltipFormatter(chartConfig)} />
              }
            />
            <Bar dataKey="proportion" name="Composition" layout="vertical" radius={[0, 5, 5, 0]} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

/**
 * Pie Chart showing connectivity proportions
 * 
 * @param data - Object containing proportions for home internet and satellite TV connectivity 
 */
function ConnectivityPieChart({ data }: { data: { homeInternet: number; satelliteTv: number } }) {
  const { homeInternet, satelliteTv } = data;

  const chartData = [
    { category: "homeInternet", proportion: homeInternet, fill: "var(--color-chart-4)" },
    { category: "satelliteTv", proportion: satelliteTv, fill: "var(--color-chart-1)" },
  ];

  const chartConfig = {
    homeInternet: {
      label: "Home Internet",
      color: "var(--chart-1)",
    },
    satelliteTv: {
      label: "Satellite TV (ASTRO)",
      color: "var(--chart-4)",
    },
  } satisfies ChartConfig;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Internet and TV</CardTitle>
        <CardDescription>Home connectivity statistics</CardDescription>
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
 * Pie Chart showing vehicle ownership proportions
 * 
 * @param data - Object containing proportions for vehicle ownership categories 
 */
function VehicleOwnershipPieChart({ data }: { data: { atLeastOneVehicle: number; noVehicle: number } }) {
  const { atLeastOneVehicle, noVehicle } = data;

  const chartData = [
    { category: "atLeastOneVehicle", proportion: atLeastOneVehicle, fill: "var(--color-atLeastOneVehicle)" },
    { category: "noVehicle", proportion: noVehicle, fill: "var(--color-noVehicle)" },
  ];

  const chartConfig = {
    atLeastOneVehicle: {
      label: "At least one car or motorcycle",
      color: "var(--chart-2)",
    },
    noVehicle: {
      label: "No car or motorcycle",
      color: "var(--chart-4)",
    },
  } satisfies ChartConfig;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Vehicle Ownership</CardTitle>
        <CardDescription>Household vehicle ownership rates</CardDescription>
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

export default function EconComponent() {
  return (
    <div className="mb-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <EmploymentStatusBarChart data={employmentData} />
        <TopIndustriesBubbleChart data={topIndustriesData} />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <HouseHoldTypesBarChart data={householdData} />
        <ConnectivityPieChart data={internetTvData} />
        <VehicleOwnershipPieChart data={vehicleData} />
      </div>
    </div>
  );
}
