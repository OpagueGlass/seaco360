import { LabelledPieChart, ProportionalBarChart } from "@/components/charts";
import { ChartConfig } from "@/components/ui/chart";
import { HealthRoundBySubdistrict } from "@/summary/health-round";

const getRatio = (binaryData: { yes: number; no: number }) => {
  return binaryData.yes / (binaryData.yes + binaryData.no);
};

function HRChronicDiseasesChart({ data }: { data: HealthRoundBySubdistrict }) {
  const { stroke, heartDisease, arthritis, kidneyDisease, hypertensionDiagnosed, diabetesDiagnosed } = data;

  const title = "Percentage of Reported Chronic Diseases";
  const description = "Prevalence of chronic conditions in the population";

  const chartData = [
    {
      category: "Heart Disease",
      count: heartDisease.yes,
      proportion: getRatio(heartDisease),
      fill: "var(--color-heartDisease)",
    },
    {
      category: "Hypertension",
      count: hypertensionDiagnosed.yes,
      proportion: getRatio(hypertensionDiagnosed),
      fill: "var(--color-hypertension)",
    },
    {
      category: "Diabetes",
      count: diabetesDiagnosed.yes,
      proportion: getRatio(diabetesDiagnosed),
      fill: "var(--color-diabetes)",
    },
    { category: "Stroke", count: stroke.yes, proportion: getRatio(stroke), fill: "var(--color-stroke)" },
    {
      category: "Arthritis",
      count: arthritis.yes,
      proportion: getRatio(arthritis),
      fill: "var(--color-arthritis)",
    },
    {
      category: "Kidney Disease",
      count: kidneyDisease.yes,
      proportion: getRatio(kidneyDisease),
      fill: "var(--color-kidneyDisease)",
    },
  ].sort((a, b) => b.proportion - a.proportion);

  const chartConfig = {
    heartDisease: {
      label: "Heart Disease",
      color: "var(--chart-5)",
    },
    hypertension: {
      label: "Hypertension",
      color: "var(--chart-1)",
    },
    diabetes: {
      label: "Diabetes",
      color: "var(--chart-4)",
    },
    stroke: {
      label: "Stroke",
      color: "var(--chart-3)",
    },
    arthritis: {
      label: "Arthritis",
      color: "var(--chart-2)",
    },
    kidneyDisease: {
      label: "Kidney Disease",
      color: "var(--chart-1)",
    },
  } satisfies ChartConfig;

  return (
    <ProportionalBarChart
      title={title}
      description={description}
      chartData={chartData}
      chartConfig={chartConfig}
      vertical
      margin={{ left: 30 }}
      minHeight={250}
    />
  );
}

function HRHypertensionScreenedChart({ data }: { data: HealthRoundBySubdistrict }) {
  const { no, yes } = data.hypertensionScreened;
  const title = "Hypertension Screening";
  const description = "Proportion of population who have been screened for hypertension";
  const chartData = [
    { category: "no", count: no, fill: "var(--color-no)" },
    { category: "yes", count: yes, fill: "var(--color-yes)" },
  ];
  const chartConfig = {
    no: {
      label: "No",
      color: "var(--chart-muted)",
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
      donutStat={{ key: "yes", label: "Screened" }}
    />
  );
}

function HRHypertensionPrevalenceChart({ data }: { data: HealthRoundBySubdistrict }) {
  const { hypertensionMeasured, hypertensionDiagnosed } = data;
  const { yes: yesHptMeasured } = hypertensionMeasured;
  const { yes: yesHptDiagnosed } = hypertensionDiagnosed;

  const title = "Hypertension Prevalence";
  const description = "Proportion of population with hypertension diagnosed and measured";
  const chartData = [
    {
      category: "Measured",
      count: yesHptMeasured,
      proportion: getRatio(hypertensionMeasured),
      fill: "var(--color-measured)",
    },
    {
      category: "Diagnosed",
      count: yesHptDiagnosed,
      proportion: getRatio(hypertensionDiagnosed),
      fill: "var(--color-diagnosed)",
    },
  ];

  const chartConfig = {
    measured: {
      label: "Measured",
      color: "var(--chart-2)",
    },
    diagnosed: {
      label: "Diagnosed",
      color: "var(--chart-1)",
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

function HRDiabetesScreenedChart({ data }: { data: HealthRoundBySubdistrict }) {
  const { no, yes } = data.diabetesScreened;
  const title = "Diabetes Screening";
  const description = "Proportion of population who have been screened for diabetes";
  const chartData = [
    { category: "no", count: no, fill: "var(--color-no)" },
    { category: "yes", count: yes, fill: "var(--color-yes)" },
  ];
  const chartConfig = {
    no: {
      label: "No",
      color: "var(--chart-muted)",
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
      donutStat={{ key: "yes", label: "Screened" }}
    />
  );
}

function HRDiabetesPrevalenceChart({ data }: { data: HealthRoundBySubdistrict }) {
  const { diabetesMeasured, diabetesDiagnosed } = data;
  const { no: noDiabMeasured, yes: yesDiabMeasured } = diabetesMeasured;
  const { no: noDiabDiagnosed, yes: yesDiabDiagnosed } = diabetesDiagnosed;
  const title = "Diabetes Prevalence";
  const description = "Proportion of population with diabetes diagnosed and measured";
  const chartData = [
    {
      category: "Measured",
      count: yesDiabMeasured,
      proportion: getRatio(diabetesMeasured),
      fill: "var(--color-measured)",
    },
    {
      category: "Diagnosed",
      count: yesDiabDiagnosed,
      proportion: getRatio(diabetesDiagnosed),
      fill: "var(--color-diagnosed)",
    },
  ];

  const chartConfig = {
    measured: {
      label: "Measured",
      color: "var(--chart-3)",
    },
    diagnosed: {
      label: "Diagnosed",
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

function HRDialysisChart({ data }: { data: HealthRoundBySubdistrict }) {
  const { no, yes } = data.underDialysis!;
  const title = "On Dialysis";
  const description = "Proportion of population on dialysis";
  const chartData = [
    { category: "no", count: no, fill: "var(--color-no)" },
    { category: "yes", count: yes, fill: "var(--color-yes)" },
  ];
  const chartConfig = {
    no: {
      label: "No",
      color: "var(--chart-muted)",
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
      donutStat={{ key: "yes", label: "On Dialysis" }}
    />
  );
}

function HRUTIPastYearChart({ data }: { data: HealthRoundBySubdistrict }) {
  const { no, yes } = data.hadUTIPastYear;
  const title = "Had Urinary Tract Infection (UTI) in Past Year";
  const description = "Proportion of population who have had UTI in the past year";
  const chartData = [
    { category: "no", count: no, fill: "var(--color-no)" },
    { category: "yes", count: yes, fill: "var(--color-yes)" },
  ];
  const chartConfig = {
    no: {
      label: "No",
      color: "var(--chart-muted)",
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
      donutStat={{ key: "yes", label: "Had UTI" }}
    />
  );
}

function HRDengueBeforeChart({ data }: { data: HealthRoundBySubdistrict }) {
  const { no, yes } = data.hadDengueBefore;
  const title = "Had Dengue Before";
  const description = "Proportion of population who have had dengue before";
  const chartData = [
    { category: "no", count: no, fill: "var(--color-no)" },
    { category: "yes", count: yes, fill: "var(--color-yes)" },
  ];
  const chartConfig = {
    no: {
      label: "No",
      color: "var(--chart-muted)",
    },
    yes: {
      label: "Yes",
      color: "var(--chart-3)",
    },
  } satisfies ChartConfig;
  return (
    <LabelledPieChart
      title={title}
      description={description}
      chartData={chartData}
      chartConfig={chartConfig}
      donut
      donutStat={{ key: "yes", label: "Had Dengue" }}
    />
  );
}

function HRDenguePastYearChart({ data }: { data: HealthRoundBySubdistrict }) {
  const { no, yes } = data.hadDenguePastYear;
  const title = "Had Dengue in Past Year";
  const description = "Proportion of population who have had dengue in the past year";
  const chartData = [
    { category: "no", count: no, fill: "var(--color-no)" },
    { category: "yes", count: yes, fill: "var(--color-yes)" },
  ];
  const chartConfig = {
    no: {
      label: "No",
      color: "var(--chart-muted)",
    },
    yes: {
      label: "Yes",
      color: "var(--chart-3)",
    },
  } satisfies ChartConfig;

  return (
    <LabelledPieChart
      title={title}
      description={description}
      chartData={chartData}
      chartConfig={chartConfig}
      donut
      donutStat={{ key: "yes", label: "Had Dengue " }}
    />
  );
}

export default function HealthRoundDiseases({ data }: { data: HealthRoundBySubdistrict }) {
  return (
    <div>
      <div className="mb-8">
        <HRChronicDiseasesChart data={data} />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <HRHypertensionScreenedChart data={data} />
        <HRHypertensionPrevalenceChart data={data} />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <HRDiabetesScreenedChart data={data} />
        <HRDiabetesPrevalenceChart data={data} />
      </div>
      {data.underDialysis && (
        <div className="mb-8 ">
          <HRDialysisChart data={data} />
        </div>
      )}
      <div className="mb-8">
        <HRUTIPastYearChart data={data} />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <HRDengueBeforeChart data={data} />
        <HRDenguePastYearChart data={data} />
      </div>
    </div>
  );
}
