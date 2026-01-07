import {
  GroupProportionalBarChartProps,
  LabelledPieChartProps,
  ProportionalBarChartProps,
  ChartProps,
  StatCardProps,
} from "@/components/types";
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
import {
  Bar,
  BarChart,
  CartesianGrid,
  Label,
  LabelList,
  Pie,
  PieChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";
import { NameType, Payload, ValueType } from "recharts/types/component/DefaultTooltipContent";

// Formats axis ticks to avoid floating point errors
function percentTickFormatter(val: number) {
  return `${Math.round(val * 1000) / 10}%`;
}

// Formats pecentage labels
function percentLabelFormatter(val: number) {
  return `${(val * 100).toFixed(0)}%`;
}

/**
 * Helper function to find the proportion of each item out of all items from their counts
 */
function getProportions(data: { count: number }[]) {
  const totalCount = data.reduce((sum, item) => sum + item.count, 0);
  return data.map((item) => ({
    ...item,
    proportion: item.count / totalCount,
  }));
}

/**
 * Custom formatter to show the counts when hovering over chart components
 */
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

/**
 * Custom formatter to show the counts by group when hovering over chart components
 */
function GroupCountTooltipFormatter(value?: ValueType, name?: NameType, item?: Payload<ValueType, NameType>) {
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

/**
 * Card wrapper for charts
 *
 * @see {@link ChartProps}
 */
function ChartCard({
  title,
  description,
  chartConfig,
  minHeight,
  maxHeight,
  children,
}: ChartProps & {
  children: React.ComponentProps<typeof ResponsiveContainer>["children"];
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={chartConfig}
          className="w-full h-full"
          style={{ minHeight: `${minHeight}px`, maxHeight: `${maxHeight}px` }}
        >
          {children}
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

/**
 * Create a bar chart scaled by percentage
 *
 * @see {@link ProportionalBarChartProps}
 * @example
 * const chartData = [
 *  { category: "no", count: 2, fill: "var(--color-no)" },
 *  { category: "yes", count: 8, fill: "var(--color-yes)" },
 * ];
 *
 * const chartConfig = {
 *   no: {
 *     label: "No",
 *     color: "var(--chart-1)",
 *   },
 *   yes: {
 *     label: "Yes",
 *     color: "var(--chart-2)",
 *  },
 * } satisfies ChartConfig;
 *
 * <ProportionalBarChart
 *    title={"Title"} description={"Description"} chartData={chartData} chartConfig={chartConfig}
 * />
 */
function ProportionalBarChart({
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
}: ProportionalBarChartProps) {
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
    <ChartCard
      title={title}
      description={description}
      chartConfig={chartConfig}
      minHeight={minHeight}
      maxHeight={maxHeight}
    >
      {vertical ? verticalBar : horizontalBar}
    </ChartCard>
  );
}

/**
 * Create a grouped bar chart scaled by percentage
 *
 * @see {@link GroupProportionalBarChartProps}
 * @example
 * const chartData = [
 *  { category: "no", measured: 2, diagnosed: 10 },
 *  { category: "yes", measured: 8, diagnosed: 3 },
 * ];
 *
 * const chartConfig = {
 *   measured: {
 *     label: "Measured",
 *     color: "var(--chart-1)",
 *   },
 *   diagnosed: {
 *     label: "Diagnosed",
 *     color: "var(--chart-2)",
 *  },
 * } satisfies ChartConfig;
 *
 * <GroupProportionalBarChart
 *    title={"Title"} description={"Description"} chartData={chartData} chartConfig={chartConfig}
 * />
 */
function GroupProportionalBarChart({
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
}: GroupProportionalBarChartProps) {
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
      <ChartTooltip content={<ChartTooltipContent nameKey="category" formatter={GroupCountTooltipFormatter} />} />
      <ChartLegend content={<ChartLegendContent />} />
      {Object.keys(percentageChartData[0])
        .filter((key) => key.includes("_proportion"))
        .map((key) => (
          <Bar key={key} dataKey={key} name={`${key} Proportion`} radius={[0, 5, 5, 0]} fill={`var(--color-${key})`}>
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
      <ChartTooltip content={<ChartTooltipContent nameKey="category" formatter={GroupCountTooltipFormatter} />} />
      <ChartLegend content={<ChartLegendContent />} />
      {Object.keys(percentageChartData[0])
        .filter((key) => key.includes("_proportion"))
        .map((key) => (
          <Bar key={key} dataKey={key} name={`${key} Proportion`} radius={[5, 5, 0, 0]} fill={`var(--color-${key})`}>
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
    <ChartCard
      title={title}
      description={description}
      chartConfig={percentageChartConfig}
      minHeight={minHeight}
      maxHeight={maxHeight}
    >
      {vertical ? verticalBar : horizontalBar}
    </ChartCard>
  );
}

/**
 * Create a labelled pie chart
 *
 * @see {@link LabelledPieChartProps}
 * @example
 * const chartData = [
 *  { category: "no", count: 2, fill: "var(--color-no)" },
 *  { category: "yes", count: 8, fill: "var(--color-yes)" },
 * ];
 *
 * const chartConfig = {
 *   no: {
 *     label: "No",
 *     color: "var(--chart-muted)",
 *   },
 *   yes: {
 *     label: "Yes",
 *     color: "var(--chart-4)",
 *  },
 * } satisfies ChartConfig;
 *
 * <LabelledPieChart
 *    title={"Title"} description={"Description"} chartData={chartData} chartConfig={chartConfig}
 * />
 */
function LabelledPieChart({
  title,
  description,
  chartData,
  chartConfig,
  disableAnimation = false,
  donut = false,
  donutStat = null,
  gridLegend = false,
  hideLegend = false,
  minHeight = 320,
  maxHeight = 320,
}: LabelledPieChartProps) {
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
                  <tspan x={viewBox.cx} y={viewBox.cy} className="fill-foreground text-3xl font-bold tracking-tight">
                    {chartData.find((item) => item.category === donutStat?.key)?.count.toLocaleString() || 0}
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
    <ChartCard
      title={title}
      description={description}
      chartConfig={chartConfig}
      minHeight={minHeight}
      maxHeight={maxHeight}
    >
      <PieChart accessibilityLayer margin={{ top: 10 }}>
        {donut ? donutChart : pieChart}
        <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel formatter={CountTooltipFormatter} />} />
        {!hideLegend && (
          <ChartLegend content={<ChartLegendContent />} className={gridLegend ? legendClass : undefined} />
        )}
      </PieChart>
    </ChartCard>
  );
}

/**
 * Creates a statistic card
 *
 * @see {@link StatCardProps}
 * @example
 * import { Users } from "lucide-react";
 *
 * <StatCard title={"Title"} description={"Description"} value={2000} icon={Users} />
 */
function StatCard({
  title,
  subtitle,
  value,
  prefix,
  suffix,
  description,
  centered = false,
  icon: Icon,
}: StatCardProps) {
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

export { GroupProportionalBarChart, LabelledPieChart, ProportionalBarChart, StatCard };

