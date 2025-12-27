import { StatCard } from "@/components/charts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { SummaryBySubdistrict } from "@/lib/summarise";
import { Star } from "lucide-react";
import { Bar, BarChart, CartesianGrid, ErrorBar, XAxis, YAxis } from "recharts";
import { NameType, Payload, ValueType } from "recharts/types/component/DefaultTooltipContent";

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
          {item?.payload.mean.toFixed(2)}
        </div>
        <span className="text-muted-foreground">Standard Deviation</span>
        <div className="text-foreground flex items-baseline font-mono font-medium tabular-nums">
          {`±${item?.payload.stdDev.toFixed(2)}`}
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
        <ChartContainer config={chartConfig} className="min-h-[200px] max-h-[250px] w-full h-full">
          <BarChart accessibilityLayer data={chartData} margin={{ left: 30, ...margin }} layout="vertical">
            <CartesianGrid vertical={false} strokeDasharray="3 3" className="stroke-muted" />
            <YAxis dataKey="category" type="category" tickLine={false} tickMargin={10} axisLine={false} />
            <XAxis dataKey="mean" type="number" width={40} tickLine={false} axisLine={false} hide={hideAxis} />
            <ChartTooltip content={<ChartTooltipContent nameKey="category" formatter={DomainTooltipFormatter} />} />
            <Bar dataKey="mean" name="Mean" radius={[0, 5, 5, 0]} layout="vertical">
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

function HROverallScoreStat({ data }: { data: SummaryBySubdistrict }) {
  const { mean, stdDev } = data.overallQoL;
  return (
    <StatCard
      title="Overall Quality of Life Score"
      subtitle="Average score across all four domains for the population"
      value={mean.toFixed(2)}
      suffix={" / 20"}
      description={
        <div className="flex items-center gap-2 text-center justify-center">
          <span className="text-muted-foreground text-base">Standard Deviation:</span>
          <span className="font-mono font-medium text-lg text-foreground">±{stdDev.toFixed(2)}</span>
        </div>
      }
      icon={Star}
      centered
    />
  );
}

export default function HealthRoundScores({ data }: { data: SummaryBySubdistrict }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-[1fr_2fr] gap-8 xl:mb-20">
      <HROverallScoreStat data={data} />
      <HRDomainScoresChart data={data} />
    </div>
  );
}
