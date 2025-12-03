import { Payload, NameType, ValueType } from "recharts/types/component/DefaultTooltipContent";
import { ChartConfig } from "./chart"

export const PercentageTooltipFormatter = (chartConfig: ChartConfig) => (
  value?: ValueType,
  name?: NameType,
  item?: Payload<ValueType, NameType>
) => (
  <>
    <div
      className="h-2.5 w-2.5 shrink-0 rounded-[2px] bg-(--color-bg) text-muted-foreground"
      style={
        {
          "--color-bg": `${item?.payload?.fill}`,
        } as React.CSSProperties
      }
    />
    <span className="text-muted-foreground">
    {chartConfig[item?.payload?.category as keyof typeof chartConfig]?.label || name}
    </span>
    <div className="text-foreground ml-auto flex items-baseline gap-0.5 font-mono font-medium tabular-nums">
      {value}
      <span className="text-muted-foreground font-normal">%</span>
    </div>
  </>
);