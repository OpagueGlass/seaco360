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
import { employmentData, householdData, industriesData, internetTvData, vehicleData } from "@/lib/mockData";
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

function EmploymentStatusBarChart({
  employmentData,
}: {
  employmentData: { category: string; count: number; fill: string }[];
}) {
  const chartConfig = {
    count: {
      label: "Count",
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
          <BarChart accessibilityLayer data={employmentData} margin={{ left: 0 }}>
            <CartesianGrid vertical={false} strokeDasharray="3 3" className="stroke-muted" />
            <XAxis dataKey="category" type="category" tickLine={false} tickMargin={10} axisLine={false} />
            <YAxis dataKey="count" type="number" tickLine={false} axisLine={false} width={24} />
            <ChartTooltip content={<ChartTooltipContent hideLabel nameKey="category" />} />
            <Bar dataKey="count" name="Count" radius={[5, 5, 0, 0]} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

function TopIndustriesBubbleChart({
  industriesData,
}: {
  industriesData: { category: string; proportion: number; fill: string }[];
}) {
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
            <XAxis type="number" dataKey="x" hide domain={[0, industriesData.length + 1]} />
            <YAxis type="number" dataKey="y" hide domain={[0, 2]} />
            <ZAxis type="number" dataKey="z" range={[0, 1000]} />
            <Tooltip
              cursor={{ strokeDasharray: "3 3" }}
              content={({ payload }) => {
                if (payload && payload.length) {
                  return (
                    <div className="rounded-lg border bg-popover p-1.5 shadow-sm">
                      <div className="flex items-center gap-2">
                        <div
                          className="h-2.5 w-2.5 shrink-0 rounded-[2px] border"
                          style={{ backgroundColor: payload[0].payload?.fill }}
                        />
                        <span className="text-xs text-muted-foreground font-medium">{payload[0].payload.category}</span>
                        <span className="ml-auto text-foreground font-mono font-semibold tabular-nums">
                          {payload[0].payload.proportion}%
                        </span>
                      </div>
                    </div>
                  );
                }
                return null;
              }}
            />
            {industriesData.map((entry, index) => (
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

function HouseHoldTypesBarChart({
  householdData,
}: {
  householdData: { category: string; proportion: number; fill: string }[];
}) {
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
          <BarChart accessibilityLayer data={householdData} layout="vertical" margin={{ left: 20 }}>
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

function ConnectivityPieChart({
  internetTvData,
}: {
  internetTvData: { category: string; proportion: number; fill: string }[];
}) {
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
            <Pie data={internetTvData} dataKey="proportion" nameKey="category" />
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

function VehicleOwnershipPieChart({
  vehicleData,
}: {
  vehicleData: { category: string; proportion: number; fill: string }[];
}) {
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
              data={vehicleData}
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
        <EmploymentStatusBarChart employmentData={employmentData} />
        <TopIndustriesBubbleChart industriesData={industriesData} />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <HouseHoldTypesBarChart householdData={householdData} />
        <ConnectivityPieChart internetTvData={internetTvData} />
        <VehicleOwnershipPieChart vehicleData={vehicleData} />
      </div>
    </div>
  );
}
