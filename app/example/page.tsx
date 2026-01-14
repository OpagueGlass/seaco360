"use client";
import { GroupProportionalBarChart, LabelledPieChart, ProportionalBarChart } from "@/components/charts";
import { ChartConfig } from "@/components/ui/chart";
import { CategoryData, GroupData } from "@/components/types";

function ExampleBarChart() {
  const chartData = [
    { category: "no", count: 12, fill: "var(--color-no)" },
    { category: "yes", count: 8, fill: "var(--color-yes)" },
  ];

  const chartConfig = {
    no: {
      label: "No",
      color: "var(--chart-1)",
    },
    yes: {
      label: "Yes",
      color: "var(--chart-2)",
    },
  } satisfies ChartConfig;

  /**
   * Configuration for Proportional Bar Charts
   *
   * @property title - Title of the chart
   * @property description - Description of the chart
   * @property chartData - An array of {@link CategoryData}
   * @property chartConfig - An object containing the category names in chartData as keys (case-sensitive) and values as
   *    an object containing the label and color of the category.
   * @property minHeight - The minimum height of the chart in pixels. Defaults to 200px
   * @property maxHeight - The maximum height of the chart in pixels. Defaults to 500px
   * @property vertical - Switches the bar chart to vertical mode which swaps the axes. Horizontal (False) by default,
   *    with categories on the X-axis and proportion on the Y-axis.
   * @property margin - An optional object partially containing the margin for the chart. Particular useful for providing
   *    space on the left with `{ left: number }` to fully show the labels of vertical charts.
   * @property hideAxis - Hides the axis of chart. False by default
   * @property hideLabel - Hides the percentage labels adjacent to bars. False by default
   */
  return (
    <ProportionalBarChart title={"Title"} description={"Description"} chartData={chartData} chartConfig={chartConfig} />
  );
}

function ExamplePieChart() {
  // Notice how the structure is the same as for the bar chart
  const chartData = [
    { category: "no", count: 12, fill: "var(--color-no)" },
    { category: "yes", count: 8, fill: "var(--color-yes)" },
  ];

  const chartConfig = {
    no: {
      label: "No",
      color: "var(--chart-1)",
    },
    yes: {
      label: "Yes",
      color: "var(--chart-2)",
    },
  } satisfies ChartConfig;

  /**
   * Configuration for Labelled Pie Charts
   *
   * @property title - Title of the chart
   * @property description - Description of the chart
   * @property chartData - An array of {@link CategoryData}
   * @property chartConfig - An object containing the category names in chartData as keys (case-sensitive) and values as
   *    an object containing the label and color of the category.
   * @property minHeight - The minimum height of the chart in pixels. Defaults to 320px
   * @property maxHeight - The maximum height of the chart in pixels. Defaults to 320px
   * @property donut - Switches to donut chart. Pie chart (False) by default.
   * @property donutStat - The statistic to show in the donut chart as an object containing the key (category) and label
   * @property gridLegend - Turns the legend into a grid, particularly useful with many categories. False by default.
   * @property hideLegend - Hides the legend
   * @property disableAnimation - Turns off the animation of the chart to constantly show labels, particularly useful with
   *    very similar values between different groups
   */
  return (
    <LabelledPieChart title={"Title"} description={"Description"} chartData={chartData} chartConfig={chartConfig} />
  );
}

function ExampleGroupBarChart() {
  const chartData = [
    { category: "no", measured: 2, diagnosed: 10 },
    { category: "yes", measured: 8, diagnosed: 3 },
  ];

  const chartConfig = {
    measured: {
      label: "Measured",
      color: "var(--chart-1)",
    },
    diagnosed: {
      label: "Diagnosed",
      color: "var(--chart-2)",
    },
  } satisfies ChartConfig;

  /**
   * Configuration for Grouped Proportional Bar Charts
   *
   * @property title - Title of the chart
   * @property description - Description of the chart
   * @property chartData - An array of {@link GroupData}
   * @property chartConfig - An object containing the category names in chartData as keys (case-sensitive) and values as
   *    an object containing the label and color of the category.
   * @property minHeight - The minimum height of the chart in pixels. Defaults to 200px
   * @property maxHeight - The maximum height of the chart in pixels. Defaults to 500px
   * @property vertical - Switches the bar chart to vertical mode which swaps the axes. Horizontal (False) by default,
   *    with categories on the X-axis and proportion on the Y-axis.
   * @property margin - An optional object partially containing the margin for the chart. Particular useful for providing
   *    space on the left to fully show the labels of vertical charts. @example { left: number }
   * @property hideAxis - Hides the axis of chart. False by default
   * @property hideLabel - Hides the percentage labels adjacent to bars. False by default
   */
  return (
    <GroupProportionalBarChart
      title={"Title"}
      description={"Description"}
      chartData={chartData}
      chartConfig={chartConfig}
    />
  );
}

export default function Page() {
  // You can switch between the different example charts here by changing the name
  //   return <ExamplePieChart />;
  return <ExampleBarChart />;
}
