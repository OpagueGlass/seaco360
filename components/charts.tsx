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
import { Bar, BarChart, CartesianGrid, Pie, PieChart, XAxis, YAxis, LabelList, Label } from "recharts";

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
}: {
  title: string;
  description: string;
  chartData: { category: string; count: number; fill: string; proportion?: number }[];
  chartConfig: ChartConfig;
  margin?: Partial<{ top: number; right: number; bottom: number; left: number }>;
  hideAxis?: boolean;
  hideLabel?: boolean;
  vertical?: boolean;
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
        tickFormatter={(val) => (val % 1 === 0 ? `${val * 100}%` : `${(val * 100).toFixed(1)}%`)}
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
            formatter={(val: number) => `${(val * 100).toFixed(0)}%`}
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
        tickFormatter={(val) => (val % 1 === 0 ? `${val * 100}%` : `${(val * 100).toFixed(1)}%`)}
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
        <ChartContainer config={chartConfig} className="min-h-[200px] max-h-[500px] w-full h-full">
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
}: {
  title: string;
  description: string;
  chartData: { category: string; [key: string]: number | string }[];
  chartConfig: ChartConfig;
  margin?: Partial<{ top: number; right: number; bottom: number; left: number }>;
  hideAxis?: boolean;
  hideLabel?: boolean;
  vertical?: boolean;
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
      <XAxis type="number" tickLine={false} axisLine={false} hide={hideAxis} tickFormatter={(val) => `${val * 100}%`} />
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
                formatter={(val: number) => `${(val * 100).toFixed(0)}%`}
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
        tickFormatter={(val) => `${val * 100}%`}
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
                formatter={(val: number) => `${(val * 100).toFixed(0)}%`}
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
        <ChartContainer config={percentageChartConfig} className="min-h-[200px] max-h-[500px] w-full h-full">
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
}: {
  title: string;
  description: string;
  chartData: { category: string; count: number; fill: string }[];
  chartConfig: ChartConfig;
  disableAnimation?: boolean;
  donut?: boolean;
  donutStat?: { key: string; label: string } | null;
  gridLegend?: boolean;
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
        {(payload.proportion * 100).toFixed(0)}%
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
    />
  );

  const donutChart = (
    <Pie
      data={percentageChartData}
      dataKey="proportion"
      nameKey="category"
      innerRadius={"50%"}
      outerRadius={"80%"}
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

  // Dynamically set grid-cols based on chartData length (max 6 columns for safety)
  const colCount = Math.ceil(chartData.length / 2);
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
            <ChartLegend content={<ChartLegendContent />} className={gridLegend ? legendClass : undefined} />
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
