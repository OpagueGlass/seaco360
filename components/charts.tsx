import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { cn } from "@/lib/utils";
import { JSX } from "react";
import { Bar, BarChart, CartesianGrid, Label, LabelList, Pie, PieChart, XAxis, YAxis } from "recharts";
import { NameType, Payload, ValueType } from "recharts/types/component/DefaultTooltipContent";

function percentTickFormatter(val: number) {
  return `${Math.round(val * 1000) / 10}%`;
}

function percentLabelFormatter(val: number) {
  return `${(val * 100).toFixed(0)}%`;
}

function getProportions(data: { count: number }[]) {
  const totalCount = data.reduce((sum, item) => sum + item.count, 0);
  return data.map((item) => ({
    ...item,
    proportion: item.count / totalCount,
  }));
}

function CountTooltipFormatter(value?: ValueType, name?: NameType, item?: Payload<ValueType, NameType>) {
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
      <span className="text-muted-foreground">Count</span>
      <div className="text-foreground ml-auto flex items-baseline gap-0.5 font-mono font-medium tabular-nums">
        {item?.payload.count}
      </div>
    </>
  );
}

function MultipleCountTooltipFormatter(value?: ValueType, name?: NameType, item?: Payload<ValueType, NameType>) {
  const originalKey = item ? item.dataKey!.toString().replace("_proportion", "") : "";
  return (
    <>
      <div
        className="h-2.5 w-2.5 shrink-0 rounded-[2px] bg-(--color-bg) text-muted-foreground"
        style={
          {
            "--color-bg": `${item?.fill}`,
          } as React.CSSProperties
        }
      />
      <span className="text-muted-foreground">Count</span>
      <div className="text-foreground ml-auto flex items-baseline gap-0.5 font-mono font-medium tabular-nums">
        {item?.payload?.[originalKey]}
      </div>
    </>
  );
}

export function ProportionalBarChart({
  title,
  description,
  chartData,
  chartConfig,
  margin,
  hideAxis = false,
  hideLabel = false,
  vertical = false,
  minHeight = 200,
  maxHeight = 500,
}: {
  title: string;
  description: string;
  chartData: { category: string; count: number; fill: string; proportion?: number }[];
  chartConfig: ChartConfig;
  margin?: Partial<{ top: number; right: number; bottom: number; left: number }>;
  hideAxis?: boolean;
  hideLabel?: boolean;
  vertical?: boolean;
  minHeight?: number;
  maxHeight?: number;
}) {
  const percentageChartData =
    "proportion" in (chartData[0] ?? {})
      ? chartData
      : getProportions(chartData as { category: string; count: number; fill: string }[]);

  const verticalBar = (
    <BarChart accessibilityLayer data={percentageChartData} layout="vertical" margin={{ right: 36, ...margin }}>
      <CartesianGrid horizontal={false} strokeDasharray="3 3" className="stroke-muted" />
      <XAxis
        dataKey="proportion"
        type="number"
        tickLine={false}
        axisLine={false}
        hide={hideAxis}
        tickFormatter={percentTickFormatter}
      />
      <YAxis dataKey="category" type="category" tickLine={false} tickMargin={10} axisLine={false} />
      <ChartTooltip content={<ChartTooltipContent hideLabel nameKey="category" formatter={CountTooltipFormatter} />} />
      <Bar dataKey="proportion" name="Proportion" layout="vertical" radius={[0, 5, 5, 0]}>
        {!hideLabel && (
          <LabelList
            dataKey="proportion"
            position="right"
            offset={8}
            className="fill-foreground"
            fontSize={12}
            formatter={percentLabelFormatter}
          />
        )}
      </Bar>
    </BarChart>
  );

  const horizontalBar = (
    <BarChart accessibilityLayer data={percentageChartData} margin={{ top: 20, ...margin }}>
      <CartesianGrid vertical={false} strokeDasharray="3 3" className="stroke-muted" />
      <XAxis dataKey="category" type="category" tickLine={false} tickMargin={10} axisLine={false} />
      <YAxis
        dataKey="proportion"
        type="number"
        width={40}
        tickLine={false}
        axisLine={false}
        tickFormatter={percentTickFormatter}
        hide={hideAxis}
      />
      <ChartTooltip content={<ChartTooltipContent hideLabel nameKey="category" formatter={CountTooltipFormatter} />} />
      <Bar dataKey="proportion" name="Proportion" radius={[5, 5, 0, 0]}>
        {!hideLabel && (
          <LabelList
            dataKey="proportion"
            position="top"
            offset={8}
            className="fill-foreground"
            fontSize={12}
            formatter={(val: number) => `${(val * 100).toFixed(0)}%`}
          />
        )}
      </Bar>
    </BarChart>
  );

  return (
    <Card className="flex flex-col h-full w-full">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col">
        <ChartContainer
          config={chartConfig}
          className="w-full h-full"
          style={{ minHeight: `${minHeight}px`, maxHeight: `${maxHeight}px` }}
        >
          {vertical ? verticalBar : horizontalBar}
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

export function MultipleProportionalBarChart({
  title,
  description,
  chartData,
  chartConfig,
  margin,
  hideAxis = false,
  hideLabel = false,
  vertical = false,
  maxHeight = 500,
}: {
  title: string;
  description: string;
  chartData: { category: string; [key: string]: number | string }[];
  chartConfig: ChartConfig;
  margin?: Partial<{ top: number; right: number; bottom: number; left: number }>;
  hideAxis?: boolean;
  hideLabel?: boolean;
  vertical?: boolean;
  maxHeight?: number;
}) {
  const percentageChartConfig = Object.entries(chartConfig).reduce((acc, [key, config]) => {
    acc[`${key}_proportion`] = {
      label: config.label,
      color: config.color,
    };
    return acc;
  }, {} as ChartConfig);

  const getCategoryProportions = (data: { [key: string]: number | string }[]) => {
    const keyTotals: Record<string, number> = {};
    data.forEach((item) => {
      Object.entries(item)
        .filter(([key]) => key !== "category")
        .forEach(([key, value]) => {
          keyTotals[key] = (keyTotals[key] ?? 0) + (value as number);
        });
    });

    return data.map((item) => {
      const newItem: { [key: string]: number | string } = { category: item.category };
      Object.entries(item)
        .filter(([key]) => key !== "category")
        .forEach(([key, value]) => {
          newItem[key] = value;
          newItem[`${key}_proportion`] = (value as number) / (keyTotals[key] || 1);
        });
      return newItem;
    });
  };

  const percentageChartData = getCategoryProportions(chartData);

  const verticalBar = (
    <BarChart accessibilityLayer data={percentageChartData} layout="vertical" margin={{ right: 36, ...margin }}>
      <CartesianGrid horizontal={false} strokeDasharray="3 3" className="stroke-muted" />
      <XAxis type="number" tickLine={false} axisLine={false} hide={hideAxis} tickFormatter={percentTickFormatter} />
      <YAxis dataKey="category" type="category" tickLine={false} tickMargin={10} axisLine={false} />
      <ChartTooltip content={<ChartTooltipContent nameKey="category" formatter={MultipleCountTooltipFormatter} />} />
      <ChartLegend content={<ChartLegendContent />} />
      {Object.keys(percentageChartData[0])
        .filter((key) => key.includes("_proportion"))
        .map((key) => (
          <Bar dataKey={key} name={`${key} Proportion`} radius={[0, 5, 5, 0]} fill={`var(--color-${key})`}>
            {!hideLabel && (
              <LabelList
                dataKey={key}
                position="right"
                offset={8}
                className="fill-foreground"
                fontSize={12}
                formatter={percentLabelFormatter}
              />
            )}
          </Bar>
        ))}
    </BarChart>
  );

  const horizontalBar = (
    <BarChart accessibilityLayer data={percentageChartData} margin={{ top: 20, ...margin }}>
      <CartesianGrid vertical={false} strokeDasharray="3 3" className="stroke-muted" />
      <XAxis dataKey="category" type="category" tickLine={false} tickMargin={10} axisLine={false} />
      <YAxis
        type="number"
        width={40}
        tickLine={false}
        axisLine={false}
        tickFormatter={percentTickFormatter}
        hide={hideAxis}
      />
      <ChartTooltip content={<ChartTooltipContent nameKey="category" formatter={MultipleCountTooltipFormatter} />} />
      <ChartLegend content={<ChartLegendContent />} />
      {Object.keys(percentageChartData[0])
        .filter((key) => key.includes("_proportion"))
        .map((key) => (
          <Bar dataKey={key} name={`${key} Proportion`} radius={[5, 5, 0, 0]} fill={`var(--color-${key})`}>
            {!hideLabel && (
              <LabelList
                dataKey={key}
                position="top"
                offset={8}
                className="fill-foreground"
                fontSize={12}
                formatter={percentLabelFormatter}
              />
            )}
          </Bar>
        ))}
    </BarChart>
  );

  return (
    <Card className="flex flex-col h-full w-full">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col">
        <ChartContainer
          config={percentageChartConfig}
          className="w-full h-full"
          style={{ minHeight: "200px", maxHeight: `${maxHeight}px` }}
        >
          {vertical ? verticalBar : horizontalBar}
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

export function LabelledPieChart({
  title,
  description,
  chartData,
  chartConfig,
  disableAnimation = false,
  donut = false,
  donutStat = null,
  gridLegend = false,
  hideLegend = false,
}: {
  title: string;
  description: string;
  chartData: { category: string; count: number; fill: string }[];
  chartConfig: ChartConfig;
  disableAnimation?: boolean;
  donut?: boolean;
  donutStat?: { key: string; label: string } | null;
  gridLegend?: boolean;
  hideLegend?: boolean;
}) {
  const percentageChartData = getProportions(chartData);

  const pieLabel = ({ payload, ...props }: any) => {
    return (
      <text
        cx={props.cx}
        cy={props.cy}
        x={props.x}
        y={props.y}
        textAnchor={props.textAnchor}
        dominantBaseline={props.dominantBaseline}
        fill="hsla(var(--foreground))"
      >
        {percentLabelFormatter(payload.proportion)}
      </text>
    );
  };

  const pieChart = (
    <Pie
      data={percentageChartData}
      dataKey="proportion"
      nameKey="category"
      label={pieLabel}
      animationDuration={600}
      isAnimationActive={!disableAnimation}
      outerRadius={"77%"}
    />
  );

  const donutChart = (
    <Pie
      data={percentageChartData}
      dataKey="proportion"
      nameKey="category"
      innerRadius={"50%"}
      outerRadius={"77%"}
      strokeWidth={2}
      stroke="var(--color-background)"
      label={pieLabel}
      animationDuration={600}
      isAnimationActive={!disableAnimation}
    >
      {donutStat && (
        <Label
          content={({ viewBox }) => {
            if (viewBox && "cx" in viewBox && "cy" in viewBox) {
              return (
                <text x={viewBox.cx} y={viewBox.cy} textAnchor="middle" dominantBaseline="middle">
                  <tspan x={viewBox.cx} y={viewBox.cy} className="fill-foreground text-3xl font-bold">
                    {chartData.find((item) => item.category === donutStat?.key)?.count || 0}
                  </tspan>
                  <tspan x={viewBox.cx} y={(viewBox.cy || 0) + 24} className="fill-muted-foreground">
                    {donutStat?.label}
                  </tspan>
                </text>
              );
            }
          }}
        />
      )}
    </Pie>
  );

  const colCount = Math.ceil(chartData.length / Math.ceil(chartData.length / 3));
  const legendClass = `grid grid-cols-${colCount} xl:flex xl:flex-row`;

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="min-h-[320px] max-h-[320px] w-full h-full">
          <PieChart accessibilityLayer margin={{ top: 10 }}>
            {donut ? donutChart : pieChart}
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel formatter={CountTooltipFormatter} />}
            />
            {!hideLegend && (
              <ChartLegend content={<ChartLegendContent />} className={gridLegend ? legendClass : undefined} />
            )}
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

export function StatCard({
  title,
  subtitle,
  value,
  prefix,
  suffix,
  description,
  centered = false,
  icon: Icon,
}: {
  title: string;
  subtitle?: string;
  value: number | string;
  prefix?: string;
  suffix?: string;
  description?: JSX.Element | string;
  centered?: boolean;
  icon: React.ComponentType<{ className?: string }>;
}) {
  return (
    <Card>
      <CardHeader className="flex-1 flex-col">
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <CardTitle>{title}</CardTitle>
            {subtitle && <CardDescription>{subtitle}</CardDescription>}
          </div>
          {Icon && <Icon className="h-4 w-4 text-muted-foreground" />}
        </div>
        <div className={cn(`space-y-2 py-4`, centered ? "text-center" : "")}>
          <div className="text-4xl font-bold tracking-tight font-mono">
            {prefix}
            {value.toLocaleString()}
            {suffix}
          </div>
          {description && typeof description === "string" ? (
            <p className="text-sm text-muted-foreground">{description}</p>
          ) : (
            description
          )}
        </div>
      </CardHeader>
    </Card>
  );
}
