import { HealthRoundBySubdistrict } from "@/summary/health-round";
import { LabelledPieChart, ProportionalBarChart, StatCard } from "@/components/charts";
import { ChartConfig } from "@/components/ui/chart";
import { DollarSign } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

function HREmploymentStatusChart({ data }: { data: HealthRoundBySubdistrict }) {
  const { student, homemaker, notWorking, working, pensioner, selfEmployed } = data.employmentStatus;
  const title = "Employment Status";
  const description = "Population breakdown by employment status";

  const chartData = [
    { category: "Employed", count: working, fill: "var(--color-employed)" },
    { category: "Self-Employed", count: selfEmployed, fill: "var(--color-selfEmployed)" },
    { category: "Unemployed", count: notWorking, fill: "var(--color-unemployed)" },
    { category: "Student", count: student, fill: "var(--color-student)" },
    { category: "Pensioner", count: pensioner, fill: "var(--color-retired)" },
    { category: "Homemaker", count: homemaker, fill: "var(--color-homemaker)" },
  ];

  const chartConfig = {
    proportion: {
      label: "Proportion",
    },
    employed: {
      label: "Employed",
      color: "var(--chart-2)",
    },
    selfEmployed: {
      label: "Self-Employed",
      color: "var(--chart-2)",
    },
    unemployed: {
      label: "Unemployed",
      color: "var(--chart-1)",
    },
    student: {
      label: "Student",
      color: "var(--chart-3)",
    },
    retired: {
      label: "Retired",
      color: "var(--chart-4)",
    },
    homemaker: {
      label: "Homemaker",
      color: "var(--chart-5)",
    },
  } satisfies ChartConfig;

  const isMobile = useIsMobile();
  return (
    <ProportionalBarChart
      title={title}
      description={description}
      chartData={chartData}
      chartConfig={chartConfig}
      margin={isMobile ? { left: 32 } : undefined}
      vertical={isMobile}
      minHeight={250}
    />
  );
}

function HRMedianIncomeStat({ data }: { data: HealthRoundBySubdistrict }) {
  const { medianIncome } = data.statistics;
  const title = "Median Monthly Household Income";
  const description = "Median monthly household income of the population";
  return (
    <StatCard title={title} prefix="RM " value={medianIncome} description={description} icon={DollarSign} centered />
  );
}

function HRIncomeChart({ data }: { data: HealthRoundBySubdistrict }) {
  const income = data.income;

  const title = "Monthly Household Income";
  const description = "Population breakdown by monthly household income";

  const chartData = [
    { category: "RM0-499", count: income["RM0-499"], fill: "var(--color-2)" },
    { category: "RM500-999", count: income["RM500-999"], fill: "var(--color-2)" },
    { category: "RM1000-1499", count: income["RM1000-1499"], fill: "var(--color-2)" },
    { category: "RM1500-1999", count: income["RM1500-1999"], fill: "var(--color-2)" },
    { category: "RM2000+", count: income["RM2000+"], fill: "var(--color-2)" },
  ];

  const chartConfig = {
    proportion: {
      label: "Proportion",
    },
    1: {
      label: "RM0-499",
      color: "var(--chart-1)",
    },
    2: {
      label: "RM500-999",
      color: "var(--chart-2)",
    },
    3: {
      label: "RM1000-1499",
      color: "var(--chart-3)",
    },
    4: {
      label: "RM1500-1999",
      color: "var(--chart-4)",
    },
    5: {
      label: "RM2000+",
      color: "var(--chart-5)",
    },
  } satisfies ChartConfig;

  return (
    <ProportionalBarChart
      title={title}
      description={description}
      chartData={chartData}
      chartConfig={chartConfig}
      maxHeight={250}
      hideAxis
      vertical
      margin={{ left: 30 }}
    />
  );
}

function HREducationLevelChart({ data }: { data: HealthRoundBySubdistrict }) {
  const { primary, secondary, tertiary, noFormalEducation, other } = data.educationLevel;

  const title = "Education Level";
  const description = "Population breakdown by highest education level attained";
  const chartData = [
    { category: "noFormalEducation", count: noFormalEducation, fill: "var(--color-noFormalEducation)" },
    { category: "primary", count: primary, fill: "var(--color-primary)" },
    { category: "secondary", count: secondary, fill: "var(--color-secondary)" },
    { category: "tertiary", count: tertiary, fill: "var(--color-tertiary)" },
    { category: "other", count: other, fill: "var(--color-other)" },
  ];
  const chartConfig = {
    noFormalEducation: {
      label: "No Formal Education",
      color: "var(--chart-1)",
    },
    primary: {
      label: "Primary",
      color: "var(--chart-4)",
    },
    secondary: {
      label: "Secondary",
      color: "var(--chart-3)",
    },
    tertiary: {
      label: "Tertiary",
      color: "var(--chart-2)",
    },
    other: {
      label: "Other",
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
      gridLegend
    />
  );
}

export default function HealthRoundEconomic({ data }: { data: HealthRoundBySubdistrict }) {
  return (
    <div>
      <div className="mb-8">
        <HREmploymentStatusChart data={data} />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-[1fr_2fr] gap-8">
        <HRMedianIncomeStat data={data} />
        <HRIncomeChart data={data} />
      </div>
      <div className="mt-8">
        <HREducationLevelChart data={data} />
      </div>
    </div>
  );
}
