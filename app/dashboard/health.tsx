import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { chronicByGenderData, chronicDiseasesData } from "@/lib/mockData";
import { Bar, BarChart, CartesianGrid, Legend, Scatter, ScatterChart, Tooltip, XAxis, YAxis, ZAxis } from "recharts";

function ChronicDiseasesBubbleChart({
  chronicDiseasesData,
}: {
  chronicDiseasesData: { category: string; proportion: number; fill: string }[];
}) {
  const chartConfig = {};
  return (
    <Card>
      <CardHeader>
        <CardTitle>Percentage of Reported Chronic Diseases</CardTitle>
        <CardDescription>Prevalence of chronic conditions in the population</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="min-h-[200px] max-h-[400px] w-full h-full">
          <ScatterChart margin={{ top: 8, left: 0 }}>
            <XAxis
              type="number"
              dataKey="x"
              domain={[0, chronicDiseasesData.length]}
              tickLine={false}
              tickFormatter={() => ""}
            />
            <YAxis
              type="number"
              dataKey="y"
              domain={[0, Math.round(Math.max(...chronicDiseasesData.map((d) => d.proportion)) * 1.1)]}
              width={24}
            />
            <ZAxis type="number" dataKey="z" range={[100, 1000]} />
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
            {chronicDiseasesData.map((entry, index) => (
              <Scatter
                name={entry.category}
                data={[{ ...entry, x: index + 0.5, y: entry.proportion, z: entry.proportion }]}
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

export function ChronicDiseasesByGenderBarChart({
  chronicByGenderData,
}: {
  chronicByGenderData: { diseases: string; male: number; female: number }[];
}) {
  const chartConfig = {
    male: {
      label: "Male",
      color: "var(--color-chart-1)",
    },
    female: {
      label: "Female",
      color: "var(--color-chart-2)",
    },
  };
  return (
    <Card>
      <CardHeader>
        <CardTitle>Number of Chronic Diseases</CardTitle>
        <CardDescription>Distribution by gender</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="min-h-[200px] max-h-[400px] w-full h-full">
          <BarChart data={chronicByGenderData}>
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
              width={24}
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  nameKey="category"
                  labelFormatter={(label: string) => {
                    label = label === "0" ? "No Diseases" : `${label} Disease${label === "1" ? "" : "s"}`;
                    return label;
                  }}
                  formatter={(value, name, item) => (
                    <>
                      <div
                        className="h-2.5 w-2.5 shrink-0 rounded-[2px] bg-(--color-bg)"
                        style={
                          {
                            "--color-bg": `${item.fill}`,
                          } as React.CSSProperties
                        }
                      />
                      {name}
                      <div className="text-foreground ml-auto flex items-baseline gap-0.5 font-mono font-medium tabular-nums">
                        {value}
                        <span className="text-muted-foreground font-normal">%</span>
                      </div>
                    </>
                  )}
                />
              }
            />
            <ChartLegend content={<ChartLegendContent />} />
            <Bar dataKey="male" name="Male" fill="var(--color-male)" radius={[4, 4, 0, 0]} />
            <Bar dataKey="female" name="Female" fill="var(--color-female)" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

export default function HealthComponent() {
  return (
    <div className="grid grid-cols-1 gap-8">
      <ChronicDiseasesBubbleChart chronicDiseasesData={chronicDiseasesData} />
      <ChronicDiseasesByGenderBarChart chronicByGenderData={chronicByGenderData} />
    </div>
  );
}
