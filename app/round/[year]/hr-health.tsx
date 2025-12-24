import { SummaryBySubdistrict } from "@/lib/summarise";
import { ChartConfig } from "@/components/ui/chart";
import { LabelledPieChart, MultipleProportionalBarChart, ProportionalBarChart } from "@/components/charts";

function HRBMIChart({ data }: { data: SummaryBySubdistrict }) {
  const { underweight, normal, overweight, obese } = data.bmiCategory;

  const title = "BMI Categories";
  const description = "Population breakdown by BMI category";
  const chartData = [
    { category: "Underweight", count: underweight, fill: "var(--color-underweight)" },
    { category: "Normal", count: normal, fill: "var(--color-normal)" },
    { category: "Overweight", count: overweight, fill: "var(--color-overweight)" },
    { category: "Obese", count: obese, fill: "var(--color-obese)" },
  ];
  const chartConfig = {
    underweight: {
      label: "Underweight",
      color: "var(--chart-1)",
    },
    normal: {
      label: "Normal",
      color: "var(--chart-2)",
    },
    overweight: {
      label: "Overweight",
      color: "var(--chart-3)",
    },
    obese: {
      label: "Obese",
      color: "var(--chart-4)",
    },
  } satisfies ChartConfig;
  return (
    <ProportionalBarChart
      title={title}
      description={description}
      chartData={chartData}
      chartConfig={chartConfig}
      hideAxis
    />
  );
}

function HRCentralObesityChart({ data }: { data: SummaryBySubdistrict }) {
  const { no, yes } = data.centralObesity;
  const title = "Central Obesity Prevalence";
  const description = "Proportion of population with central obesity";
  const chartData = [
    { category: "no", count: no, fill: "var(--color-no)" },
    { category: "yes", count: yes, fill: "var(--color-yes)" },
  ];
  const chartConfig = {
    no: {
      label: "No",
      color: "var(--chart-2)",
    },
    yes: {
      label: "Yes",
      color: "var(--chart-1)",
    },
  } satisfies ChartConfig;
  return (
    <LabelledPieChart
      title={title}
      description={description}
      chartData={chartData}
      chartConfig={chartConfig}
      donut
      donutStat={{ key: "yes", label: "With Central Obesity" }}
    />
  );
}

function HRSmokedBeforeChart({ data }: { data: SummaryBySubdistrict }) {
  const { no, yes } = data.hadDengueBefore;
  const title = "Smoked Before";
  const description = "Proportion of population who have smoked before";
  const chartData = [
    { category: "no", count: no, fill: "var(--color-no)" },
    { category: "yes", count: yes, fill: "var(--color-yes)" },
  ];
  const chartConfig = {
    no: {
      label: "No",
      color: "var(--chart-3)",
    },
    yes: {
      label: "Yes",
      color: "var(--chart-4)",
    },
  } satisfies ChartConfig;

  return (
    <LabelledPieChart
      title={title}
      description={description}
      chartData={chartData}
      chartConfig={chartConfig}
      donut
      donutStat={{ key: "yes", label: "Have Smoked" }}
    />
  );
}

function HRSmokesNowChart({ data }: { data: SummaryBySubdistrict }) {
  const { no, yes } = data.isCurrentlySmoking;
  const title = "Smokes Now";
  const description = "Proportion of population who currently smoke";
  const chartData = [
    { category: "no", count: no, fill: "var(--color-no)" },
    { category: "yes", count: yes, fill: "var(--color-yes)" },
  ];
  const chartConfig = {
    no: {
      label: "No",
      color: "var(--chart-2)",
    },
    yes: {
      label: "Yes",
      color: "var(--chart-5)",
    },
  } satisfies ChartConfig;
  return (
    <LabelledPieChart
      title={title}
      description={description}
      chartData={chartData}
      chartConfig={chartConfig}
      donut
      donutStat={{ key: "yes", label: "Currently Smoke" }}
    />
  );
}

function HRInadequateFruitVegChart({ data }: { data: SummaryBySubdistrict }) {
  const { no: noFruit, yes: yesFruit } = data.inadequateFruit!;
  const { no: noVeg, yes: yesVeg } = data.inadequateVegetable!;
  const title = "Inadequate Fruit & Vegetable Intake";
  const description = "Proportion of population with inadequate fruit and vegetable intake";

  const chartData = [
    { category: "No", fruit: noFruit, veg: noVeg },
    { category: "Yes", fruit: yesFruit, veg: yesVeg },
  ];

  const chartConfig = {
    fruit: {
      label: "Fruit",
      color: "var(--chart-1)",
    },
    veg: {
      label: "Vegetable",
      color: "var(--chart-2)",
    },
  } satisfies ChartConfig;

  return (
    <MultipleProportionalBarChart
      title={title}
      description={description}
      chartData={chartData}
      chartConfig={chartConfig}
    />
  );
}

export default function HealthRoundHealth({ data }: { data: SummaryBySubdistrict }) {
  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mb-8">
        <HRBMIChart data={data} />
        <HRCentralObesityChart data={data} />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
        <HRSmokedBeforeChart data={data} />
        <HRSmokesNowChart data={data} />
      </div>
      {data.inadequateFruit && data.inadequateVegetable && (
        <div className="mt-8">
          <HRInadequateFruitVegChart data={data} />
        </div>
      )}
    </div>
  );
}
