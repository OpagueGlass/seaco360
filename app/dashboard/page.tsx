"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
  ScatterChart,
  Scatter,
  ZAxis,
} from "recharts";

// Chart colors using CSS variables (shadcn theme)
const chartColors = {
  chart1: "hsl(var(--chart-1))",
  chart2: "hsl(var(--chart-2))",
  chart3: "hsl(var(--chart-3))",
  chart4: "hsl(var(--chart-4))",
  chart5: "hsl(var(--chart-5))",
};

// Census response data
const censusResponseData = [
  { name: "Agreed", value: 6200, fill: "var(--color-chart-1)" },
  { name: "Refused", value: 800, fill: "var(--color-chart-2)" },
  { name: "Not at Home", value: 4500, fill: "var(--color-chart-3)" },
  { name: "Unoccupied", value: 2200, fill: "var(--color-chart-4)" },
];

// Ethnic composition data
const ethnicData = [
  { name: "Malay", value: 62.5, fill: "var(--color-chart-1)" },
  { name: "Chinese", value: 25, fill: "var(--color-chart-2)" },
  { name: "Indian", value: 8, fill: "var(--color-chart-3)" },
  { name: "Orang Asli", value: 4.5, fill: "var(--color-chart-4)" },
];

// Gender distribution data
const genderData = [
  { name: "Male", value: 48.5, fill: "var(--color-chart-1)" },
  { name: "Female", value: 51.5, fill: "var(--color-chart-2)" },
];

// Senior population data
const seniorData = [
  { name: "Senior (60+)", value: 18, fill: "var(--color-chart-3)" },
  { name: "Non-Senior", value: 82, fill: "var(--color-chart-4)" },
];

// Health - Chronic diseases data
const chronicDiseasesData = [
  { name: "Hypertension", value: 29, fill: "var(--color-chart-1)" },
  { name: "Diabetes", value: 12, fill: "var(--color-chart-2)" },
  { name: "Heart Disease", value: 4, fill: "var(--color-chart-3)" },
  { name: "Stroke", value: 2, fill: "var(--color-chart-4)" },
  { name: "Arthritis", value: 4, fill: "var(--color-chart-5)" },
  { name: "Kidney Disease", value: 1, fill: "var(--color-chart-1)" },
];

// Number of chronic diseases by gender
const chronicByGenderData = [
  { diseases: "0", male: 62, female: 57 },
  { diseases: "1", male: 15, female: 18 },
  { diseases: "2", male: 10, female: 12 },
  { diseases: "3", male: 5, female: 6 },
  { diseases: "4", male: 3, female: 4 },
  { diseases: "5+", male: 5, female: 3 },
];

// Economic - Employment status data
const employmentData = [
  { name: "Employed", value: 60, fill: "var(--color-chart-1)" },
  { name: "Unemployed", value: 5, fill: "var(--color-chart-2)" },
  { name: "Student", value: 20, fill: "var(--color-chart-3)" },
  { name: "Retired", value: 8, fill: "var(--color-chart-4)" },
  { name: "Homemaker", value: 5, fill: "var(--color-chart-5)" },
];

// Top 5 industries bubble data
const industriesData = [
  { name: "Agriculture, forestry and fishing", x: 1, y: 1, z: 1200, fill: "var(--color-chart-1)" },
  { name: "Wholesale and retail trade", x: 2, y: 1, z: 600, fill: "var(--color-chart-2)" },
  { name: "Accommodation & food services", x: 3, y: 1, z: 400, fill: "var(--color-chart-3)" },
  { name: "Manufacturing", x: 4, y: 1, z: 300, fill: "var(--color-chart-4)" },
  { name: "Education", x: 5, y: 1, z: 200, fill: "var(--color-chart-5)" },
];

// Household types data
const householdData = [
  { name: "Nuclear family", value: 75, fill: "var(--color-chart-1)" },
  { name: "Extended family", value: 20, fill: "var(--color-chart-2)" },
  { name: "Other types of sharing", value: 5, fill: "var(--color-chart-3)" },
];

// Internet and TV data
const internetTvData = [
  { name: "Home Internet", value: 25, fill: "var(--color-chart-4)" },
  { name: "Satellite TV (ASTRO)", value: 75, fill: "var(--color-chart-1)" },
];

// Vehicle ownership data
const vehicleData = [
  { name: "At least one car or motorcycle", value: 70, fill: "var(--color-chart-2)" },
  { name: "No car or motorcycle", value: 30, fill: "var(--color-chart-5)" },
];

// Custom tooltip component matching shadcn style
const CustomTooltip = ({ active, payload, label, valueFormatter }: {
  active?: boolean;
  payload?: Array<{ value: number; name: string; color?: string; fill?: string }>;
  label?: string;
  valueFormatter?: (value: number) => string;
}) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-lg border bg-background p-2 shadow-sm">
        <div className="grid gap-2">
          {label && (
            <div className="text-xs text-muted-foreground font-medium">{label}</div>
          )}
          {payload.map((entry, index) => (
            <div key={index} className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-1.5">
                <div
                  className="h-2.5 w-2.5 shrink-0 rounded-[2px]"
                  style={{ backgroundColor: entry.color || entry.fill }}
                />
                <span className="text-xs text-muted-foreground">{entry.name}</span>
              </div>
              <span className="text-xs font-medium tabular-nums">
                {valueFormatter ? valueFormatter(entry.value) : entry.value}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  }
  return null;
};

// Custom legend component matching shadcn style
const CustomLegend = ({ payload }: { payload?: Array<{ value: string; color: string }> }) => {
  if (!payload) return null;
  return (
    <div className="flex flex-wrap items-center justify-center gap-4 pt-3">
      {payload.map((entry, index) => (
        <div key={index} className="flex items-center gap-1.5">
          <div
            className="h-2.5 w-2.5 shrink-0 rounded-[2px]"
            style={{ backgroundColor: entry.color }}
          />
          <span className="text-xs text-muted-foreground">{entry.value}</span>
        </div>
      ))}
    </div>
  );
};

export default function Page() {
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>

      <Tabs defaultValue="census" className="w-full">
        <TabsList className="grid grid-cols-3">
          <TabsTrigger value="census" className="text-center">
            Demographics
          </TabsTrigger>
          <TabsTrigger value="economic" className="text-center">
            Economic
          </TabsTrigger>
          <TabsTrigger value="health" className="text-center">
            Health
          </TabsTrigger>
        </TabsList>

        <TabsContent value="census" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Census Response Bar Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Census Response</CardTitle>
                <CardDescription>Household response rates during census collection</CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={censusResponseData} margin={{ top: 20, right: 12 }}>
                    <CartesianGrid vertical={false} strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis
                      dataKey="name"
                      tickLine={false}
                      axisLine={false}
                      tickMargin={10}
                      className="text-xs fill-muted-foreground"
                    />
                    <YAxis tickLine={false} axisLine={false} className="text-xs fill-muted-foreground" />
                    <Tooltip content={<CustomTooltip />} cursor={{ fill: "var(--color-muted)", opacity: 0.3 }} />
                    <Bar dataKey="value" name="Count" radius={[4, 4, 0, 0]}>
                      {censusResponseData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Ethnic Composition Bar Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Ethnic Composition</CardTitle>
                <CardDescription>Population breakdown by ethnicity</CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={ethnicData} layout="vertical" margin={{ left: 12, right: 12 }}>
                    <CartesianGrid horizontal={false} strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis
                      type="number"
                      domain={[0, 70]}
                      tickLine={false}
                      axisLine={false}
                      className="text-xs fill-muted-foreground"
                    />
                    <YAxis
                      type="category"
                      dataKey="name"
                      width={80}
                      tickLine={false}
                      axisLine={false}
                      className="text-xs fill-muted-foreground"
                    />
                    <Tooltip content={<CustomTooltip valueFormatter={(v) => `${v}%`} />} cursor={{ fill: "var(--color-muted)", opacity: 0.3 }} />
                    <Bar dataKey="value" name="Percentage" radius={[0, 4, 4, 0]}>
                      {ethnicData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Gender Distribution Pie Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Gender Distribution</CardTitle>
                <CardDescription>Population breakdown by gender</CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={genderData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      strokeWidth={2}
                      stroke="var(--color-background)"
                      dataKey="value"
                    >
                      {genderData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip valueFormatter={(v) => `${v}%`} />} />
                    <Legend content={<CustomLegend />} />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Senior Population Pie Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Senior Population</CardTitle>
                <CardDescription>Population aged 60 and above</CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={seniorData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      strokeWidth={2}
                      stroke="var(--color-background)"
                      dataKey="value"
                    >
                      {seniorData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip valueFormatter={(v) => `${v}%`} />} />
                    <Legend content={<CustomLegend />} />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="economic" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Employment Status Bar Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Employment Status</CardTitle>
                <CardDescription>Population breakdown by employment status</CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={employmentData} margin={{ top: 20, right: 12 }}>
                    <CartesianGrid vertical={false} strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis
                      dataKey="name"
                      tickLine={false}
                      axisLine={false}
                      tickMargin={10}
                      className="text-xs fill-muted-foreground"
                    />
                    <YAxis
                      domain={[0, 70]}
                      tickLine={false}
                      axisLine={false}
                      className="text-xs fill-muted-foreground"
                    />
                    <Tooltip content={<CustomTooltip valueFormatter={(v) => `${v}%`} />} cursor={{ fill: "var(--color-muted)", opacity: 0.3 }} />
                    <Bar dataKey="value" name="Percentage" radius={[4, 4, 0, 0]}>
                      {employmentData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Top 5 Industries Bubble Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Top 5 Industries by Employee Count</CardTitle>
                <CardDescription>Major employment sectors</CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <ResponsiveContainer width="100%" height={300}>
                  <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                    <XAxis type="number" dataKey="x" hide domain={[0, 6]} />
                    <YAxis type="number" dataKey="y" hide domain={[0, 2]} />
                    <ZAxis type="number" dataKey="z" range={[100, 1000]} />
                    <Tooltip
                      cursor={{ strokeDasharray: "3 3" }}
                      content={({ payload }) => {
                        if (payload && payload.length) {
                          const data = payload[0].payload;
                          return (
                            <div className="rounded-lg border bg-background p-2 shadow-sm">
                              <p className="font-medium text-sm">{data.name}</p>
                              <p className="text-xs text-muted-foreground">Employees: {data.z}</p>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <Scatter data={industriesData}>
                      {industriesData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Scatter>
                  </ScatterChart>
                </ResponsiveContainer>
                <div className="flex flex-wrap gap-4 justify-center pt-3">
                  {industriesData.map((item, index) => (
                    <div key={index} className="flex items-center gap-1.5">
                      <div className="h-2.5 w-2.5 shrink-0 rounded-[2px]" style={{ backgroundColor: item.fill }} />
                      <span className="text-xs text-muted-foreground">{item.name}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Household Types Bar Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Household Types</CardTitle>
                <CardDescription>Distribution of household compositions</CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={householdData} layout="vertical" margin={{ left: 12, right: 12 }}>
                    <CartesianGrid horizontal={false} strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis
                      type="number"
                      domain={[0, 80]}
                      tickLine={false}
                      axisLine={false}
                      className="text-xs fill-muted-foreground"
                    />
                    <YAxis
                      type="category"
                      dataKey="name"
                      width={130}
                      tickLine={false}
                      axisLine={false}
                      className="text-xs fill-muted-foreground"
                    />
                    <Tooltip content={<CustomTooltip valueFormatter={(v) => `${v}%`} />} cursor={{ fill: "var(--color-muted)", opacity: 0.3 }} />
                    <Bar dataKey="value" name="Percentage" radius={[0, 4, 4, 0]}>
                      {householdData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Internet and TV Pie Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Internet and TV</CardTitle>
                <CardDescription>Home connectivity statistics</CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={internetTvData}
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      strokeWidth={2}
                      stroke="var(--color-background)"
                      dataKey="value"
                    >
                      {internetTvData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip valueFormatter={(v) => `${v}%`} />} />
                    <Legend content={<CustomLegend />} />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Vehicle Ownership Donut Chart */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Vehicle Ownership</CardTitle>
                <CardDescription>Household vehicle ownership rates</CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={vehicleData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      strokeWidth={2}
                      stroke="var(--color-background)"
                      dataKey="value"
                    >
                      {vehicleData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip valueFormatter={(v) => `${v}%`} />} />
                    <Legend content={<CustomLegend />} />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="health" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Chronic Diseases Bubble Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Percentage of Reported Chronic Diseases</CardTitle>
                <CardDescription>Prevalence of chronic conditions in the population</CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <ResponsiveContainer width="100%" height={300}>
                  <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis
                      type="category"
                      dataKey="name"
                      allowDuplicatedCategory={false}
                      tickLine={false}
                      axisLine={false}
                      className="text-xs fill-muted-foreground"
                    />
                    <YAxis
                      type="number"
                      domain={[0, 30]}
                      tickLine={false}
                      axisLine={false}
                      className="text-xs fill-muted-foreground"
                    />
                    <ZAxis type="number" dataKey="value" range={[100, 800]} />
                    <Tooltip
                      content={({ payload }) => {
                        if (payload && payload.length) {
                          const data = payload[0].payload;
                          return (
                            <div className="rounded-lg border bg-background p-2 shadow-sm">
                              <p className="font-medium text-sm">{data.name}</p>
                              <p className="text-xs text-muted-foreground">{data.value}%</p>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <Scatter
                      data={chronicDiseasesData.map((d, i) => ({ ...d, x: i }))}
                      dataKey="value"
                    >
                      {chronicDiseasesData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Scatter>
                  </ScatterChart>
                </ResponsiveContainer>
                <div className="flex flex-wrap gap-4 justify-center pt-3">
                  {chronicDiseasesData.map((item, index) => (
                    <div key={index} className="flex items-center gap-1.5">
                      <div className="h-2.5 w-2.5 shrink-0 rounded-[2px]" style={{ backgroundColor: item.fill }} />
                      <span className="text-xs text-muted-foreground">{item.name}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Number of Chronic Diseases by Gender */}
            <Card>
              <CardHeader>
                <CardTitle>Number of Chronic Diseases</CardTitle>
                <CardDescription>Distribution by gender</CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={chronicByGenderData} margin={{ top: 20, right: 12 }}>
                    <CartesianGrid vertical={false} strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis
                      dataKey="diseases"
                      tickLine={false}
                      axisLine={false}
                      tickMargin={10}
                      className="text-xs fill-muted-foreground"
                    />
                    <YAxis
                      domain={[0, 70]}
                      tickLine={false}
                      axisLine={false}
                      className="text-xs fill-muted-foreground"
                    />
                    <Tooltip content={<CustomTooltip valueFormatter={(v) => `${v}%`} />} cursor={{ fill: "var(--color-muted)", opacity: 0.3 }} />
                    <Legend content={<CustomLegend />} />
                    <Bar dataKey="male" name="Male" fill="var(--color-chart-1)" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="female" name="Female" fill="var(--color-chart-2)" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
