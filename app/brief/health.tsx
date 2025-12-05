import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { chronicByGenderData, chronicDiseasesData } from "@/lib/mockData";
import { colourIndex } from "@/lib/utils";
import { Bar, BarChart, CartesianGrid, Legend, Scatter, ScatterChart, Tooltip, XAxis, YAxis, ZAxis } from "recharts";

/**
 * Bubble chart showing prevalence of chronic diseases
 *
 * @param data - Array of objects containing category and proportion of chronic diseases
 */
function ChronicDiseasesBubbleChart({ data }: { data: { category: string; proportion: number }[] }) {
  const chartData = data.map(colourIndex);

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

/**
 * Bar chart showing number of chronic diseases by gender
 * 
 * @param data - Array of objects containing the male and female proportions for number of chronic diseases, with 
 *               the index representing number of diseases, with the last index representing that number or more.
 */
export function ChronicDiseasesByGenderBarChart({ data }: { data: { male: number; female: number }[] }) {
  const chartData = data.map((item, index) => ({
    diseases: `${index.toString()}${data.length - 1 === index ? "+" : ""}`,
    ...item,
  }));

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
          <BarChart data={chartData}>
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
                      <span className="text-muted-foreground">{name}</span>
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
      <ChronicDiseasesBubbleChart data={chronicDiseasesData} />
      <ChronicDiseasesByGenderBarChart data={chronicByGenderData} />
    </div>
  );
}
