import { SummaryBySubdistrict } from "@/lib/summarise";
import { LabelledPieChart, MultipleProportionalBarChart, ProportionalBarChart } from "@/components/charts";
import { NameType, Payload, ValueType } from "recharts/types/component/DefaultTooltipContent";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Bar, BarChart, CartesianGrid, Pie, PieChart, XAxis, YAxis, LabelList, Label, ErrorBar } from "recharts";

function DomainTooltipFormatter(value?: ValueType, name?: NameType, item?: Payload<ValueType, NameType>) {
  return (
    <>
      <div
        className="h-2.5 w-2.5 shrink-0 rounded-[2px] bg-(--color-bg) text-muted-foreground"
        style={
          {
            "--color-bg": `${item?.payload?.fill}`,
          } as React.CSSProperties
        }
      />
      <div className="grid grid-cols-1">
        <span className="text-muted-foreground">Mean</span>
        <div className="text-foreground flex items-baseline font-mono font-medium tabular-nums">
          {item?.payload.mean}
        </div>
        <span className="text-muted-foreground">Standard Deviation</span>
        <div className="text-foreground flex items-baseline font-mono font-medium tabular-nums">
          {`±${item?.payload.stdDev}`}
        </div>
      </div>
    </>
  );
}

function DomainScoreBar({
  title,
  description,
  chartData,
  chartConfig,
  margin,
  hideAxis = false,
  hideLabel = false,
}: {
  title: string;
  description: string;
  chartData: { category: string; mean: number; stdDev: number; fill: string; proportion?: number }[];
  chartConfig: ChartConfig;
  margin?: Partial<{ top: number; right: number; bottom: number; left: number }>;
  hideAxis?: boolean;
  hideLabel?: boolean;
  vertical?: boolean;
}) {
  return (
    <Card className="flex flex-col h-full w-full">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col">
        <ChartContainer config={chartConfig} className="min-h-[200px] max-h-[500px] w-full h-full">
          <BarChart accessibilityLayer data={chartData} margin={{ top: 20, ...margin }}>
            <CartesianGrid vertical={false} strokeDasharray="3 3" className="stroke-muted" />
            <XAxis dataKey="category" type="category" tickLine={false} tickMargin={10} axisLine={false} />
            <YAxis dataKey="mean" type="number" width={40} tickLine={false} axisLine={false} hide={hideAxis} />
            <ChartTooltip
              content={<ChartTooltipContent nameKey="category" formatter={DomainTooltipFormatter} />}
            />
            <Bar dataKey="mean" name="Mean" radius={[5, 5, 0, 0]}>
              <ErrorBar stroke="var(--foreground)" dataKey="stdDev" width={4} strokeWidth={2} direction="y" />
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

function HRDomainScoresChart({ data }: { data: SummaryBySubdistrict }) {
  const { physicalHealth, psychologicalHealth, socialRelationships, environment } = data;

  const title = "Quality of Life Scores by Domain";
  const description = "Scores for each domain across the population";

  const chartData = [
    { category: "Physical Health", fill: "var(--color-physicalHealth)", ...physicalHealth },
    { category: "Psychological Health", fill: "var(--color-psychologicalHealth)", ...psychologicalHealth },
    { category: "Social Relationships", fill: "var(--color-socialRelationships)", ...socialRelationships },
    { category: "Environment", fill: "var(--color-environment)", ...environment },
  ];

  const chartConfig = {
    physicalHealth: {
      label: "Physical Health",
      color: "var(--chart-1)",
    },
    psychologicalHealth: {
      label: "Psychological Health",
      color: "var(--chart-2)",
    },
    socialRelationships: {
      label: "Social Relationships",
      color: "var(--chart-3)",
    },
    environment: {
      label: "Environment",
      color: "var(--chart-4)",
    },
  } satisfies ChartConfig;

  return <DomainScoreBar title={title} description={description} chartData={chartData} chartConfig={chartConfig} />;
}

function OverallScoreCard({ data }: { data: SummaryBySubdistrict }) {
  const { mean, stdDev } = data.overallQoL;
  return (
    <Card className="flex flex-col h-full w-full">
      <CardHeader>
        <CardTitle>Overall Quality of Life Score</CardTitle>
        <CardDescription>
          Average score across all four domains for the population
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col justify-center items-center">
        <div className="flex flex-col gap-4 items-center">
          <div className="text-6xl font-mono font-bold text-foreground">
            {mean}
          </div>
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground text-base">Standard Deviation:</span>
            <span className="font-mono font-medium text-lg text-foreground">±{stdDev}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function HealthRoundScores({ data }: { data: SummaryBySubdistrict }) {
  return <div>
    <div className="mb-8 h-92">
      <OverallScoreCard data={data} />

    </div>
    <div className="mb-8">
      <HRDomainScoresChart data={data} />
    </div>
  </div>;
}
