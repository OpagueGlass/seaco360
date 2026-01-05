import { JSX } from "react";
import { ChartConfig } from "@/components/ui/chart";

/**
 * Information about each category in a chart
 *
 * @property category - The name of the category
 * @property count - The number of times this category appears
 * @property fill - The colour to represent this category
 * @property proportion - If present, the chart will use those proportions instead of inferring from the counts
 */
interface CategoryData {
  /** The name of the category */
  category: string;
  /** The number of times this category appears */
  count: number;
  /** The colour to represent this category */
  fill: string;
  /** If present, the chart will use those proportions instead of inferring from the counts */
  proportion?: number;
}

/**
 * Information about each category and group in a chart
 *
 * @property category - The name of the group
 * @property [key: string] - Count of each category as an object of keys as the category name and values as their
 *    associated counts
 */
interface GroupData {
  /** The name of the group */
  category: string;
  /** Count of each category as an object of keys with the category name and values as their associated counts */
  [key: string]: number | string;
}

interface ProportionalProps {
  /** Title of the chart */
  title: string;
  /** Description of the chart  */
  description: string;
  /**An object containing the categories in chartData as keys (case-sensitive) and values as an object containing the
   * label and color of the category. */
  chartConfig: ChartConfig;
  /** The minimum height of the chart. Defaults to 200px */
  minHeight?: number;
  /** The maximum height of the chart. Defaults to 500px */
  maxHeight?: number;
}

interface ProportionalBarProps extends ProportionalProps {
  /** Switches the bar chart to vertical mode which swaps the axes. Horizontal (False) by default, with categories on
   * the X-axis and proportion on the Y-axis. */
  vertical?: boolean;
  /** An optional object partially containing the margin for the chart. Particular useful for providing space on the
   * left with `{ left: number }` to fully show the labels of vertical charts.*/
  margin?: Partial<{ top: number; right: number; bottom: number; left: number }>;
  /** Hides the axis of chart. False by default */
  hideAxis?: boolean;
  /** Hides the percentage labels adjacent to bars. False by default*/
  hideLabel?: boolean;
}

/**
 * Configuration for Proportional Bar Charts
 *
 * @property title - Title of the chart
 * @property description - Description of the chart
 * @property chartData - An array of {@link CategoryData}
 * @property chartConfig - An object containing the category names in chartData as keys (case-sensitive) and values as
 *    an object containing the label and color of the category.
 * @property minHeight - The minimum height of the chart. Defaults to 200px
 * @property maxHeight - The maximum height of the chart. Defaults to 500px
 * @property vertical - Switches the bar chart to vertical mode which swaps the axes. Horizontal (False) by default,
 *    with categories on the X-axis and proportion on the Y-axis.
 * @property margin - An optional object partially containing the margin for the chart. Particular useful for providing
 *    space on the left with `{ left: number }` to fully show the labels of vertical charts.
 * @property hideAxis - Hides the axis of chart. False by default
 * @property hideLabel - Hides the percentage labels adjacent to bars. False by default
 */
export interface ProportionalBarChartProps extends ProportionalBarProps {
  /** An array of {@link CategoryData} */
  chartData: CategoryData[];
}

/**
 * Configuration for Grouped Proportional Bar Charts
 *
 * @property title - Title of the chart
 * @property description - Description of the chart
 * @property chartData - An array of {@link GroupData}
 * @property chartConfig - An object containing the category names in chartData as keys (case-sensitive) and values as
 *    an object containing the label and color of the category.
 * @property minHeight - The minimum height of the chart. Defaults to 200px
 * @property maxHeight - The maximum height of the chart. Defaults to 500px
 * @property vertical - Switches the bar chart to vertical mode which swaps the axes. Horizontal (False) by default,
 *    with categories on the X-axis and proportion on the Y-axis.
 * @property margin - An optional object partially containing the margin for the chart. Particular useful for providing
 *    space on the left to fully show the labels of vertical charts. @example { left: number }
 * @property hideAxis - Hides the axis of chart. False by default
 * @property hideLabel - Hides the percentage labels adjacent to bars. False by default
 */
export interface GroupProportionalBarChartProps extends ProportionalBarProps {
  /** An array of {@link GroupData} */
  chartData: GroupData[];
}
/**
 * Configuration for Labelled Pie Charts
 *
 * @property title - Title of the chart
 * @property description - Description of the chart
 * @property chartData - An array of {@link CategoryData}
 * @property chartConfig - An object containing the category names in chartData as keys (case-sensitive) and values as
 *    an object containing the label and color of the category.
 * @property donut - Switches to donut chart. Pie chart (False) by default.
 * @property donutStat - The statistic to show in the donut chart as an object containing the key (category) and label
 * @property gridLegend - Turns the legend into a grid, particularly useful with many categories. False by default.
 * @property hideLegend - Hides the legend
 * @property disableAnimation - Turns off the animation of the chart to constantly show labels, particularly useful with
 *    very similar values between different groups
 */
export interface LabelledPieChartProps extends ProportionalProps {
  /** An array of {@link CategoryData} */
  chartData: CategoryData[];
  /** Switches to donut chart. Pie chart (False) by default. */
  donut?: boolean;
  /** The statistic to show in the donut chart as an object containing the key (category) and label */
  donutStat?: { key: string; label: string } | null;
  /** Turns the legend into a grid, particularly useful with many categories. False by default. */
  gridLegend?: boolean;
  /** Hides the legend */
  hideLegend?: boolean;
  /** Turns off the animation of the chart to constantly show labels, particularly useful with very similar values
   * between different groups */
  disableAnimation?: boolean;
}

/**
 * Configuration for Statistic Cards
 *
 * @property title - Title of the stat card
 * @property subtitle - Optional subtitle of the stat card
 * @property value - Value of the stat card
 * @property prefix - The optional text to put in front of the value
 * @property suffix - The optional text to put at the back of the value
 * @property description - The optional description of the statistic
 * @property centered - Whether to center the statistic on the card. False by default.
 * @icon Icon - The icon to show on the top right of the card
 */
export interface StatCardProps {
  /** Title of the stat card */
  title: string;
  /** Optional subtitle of the stat card */
  subtitle?: string;
  /** Value of the stat card */
  value: number | string;
  /** The optional text to put in front of the value */
  prefix?: string;
  /** The optional text to put at the back of the value */
  suffix?: string;
  /** The optional description of the statistic */
  description?: JSX.Element | string;
  /** Whether to center the statistic on the card. False by default. */
  centered?: boolean;
  /** The icon to show on the top right of the card */
  icon: React.ComponentType<{ className?: string }>;
}
