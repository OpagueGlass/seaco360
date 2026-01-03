import { LabelledPieChart, ProportionalBarChart, StatCard } from "@/components/charts";
import { ChartConfig } from "@/components/ui/chart";
import { useIsMobile } from "@/hooks/use-mobile";
import { HealthRoundBySubdistrict } from "@/summary/health-round";
import { Hourglass, Users } from "lucide-react";

function HRParticipantsStat({ data }: { data: HealthRoundBySubdistrict }) {
  const { participants } = data.statistics;
  const title = "Total Participants";
  const description = "Participated in this health round";

  return (
    <StatCard
      title={title}
      value={participants}
      description={description}
      icon={Users}
    />
  );
}

function HRMedianAgeStat({ data }: { data: HealthRoundBySubdistrict }) {
  const { medianAge } = data.statistics;
  const title = "Median Age";
  const description = "Median age of participants";
  return (
    <StatCard
      title={title}
      value={medianAge}
      description={description}
      icon={Hourglass}
    />
  );
}

function HRAgeChart({ data }: { data: HealthRoundBySubdistrict }) {
  const {"0-4": _, ...ageGroups} = data.age;

  const title = "Age Distribution";
  const description = "Population breakdown by age group";

  const chartData = Object.entries(ageGroups)
    .sort(([a], [b]) => parseInt(a) - parseInt(b))
    .map(([category, count]) => ({
      category,
      count,
      fill: "var(--chart-1)",
    }));

  const chartConfig = {
    count: {
      label: "Count",
      color: "var(--chart-1)",
    },
  } satisfies ChartConfig;

  const isMobile = useIsMobile();
  return (
    <ProportionalBarChart
      title={title}
      description={description}
      chartData={chartData}
      chartConfig={chartConfig}
      vertical={isMobile}
      minHeight={500}
    />
  );
}

function HREthnicityChart({ data }: { data: HealthRoundBySubdistrict }) {
  const { malay, chinese, indian, orangAsli, nonCitizen, other } = data.ethnicity;

  const title = "Ethnic Composition";
  const description = "Population breakdown by ethnicity";

  const chartData = [
    { category: "Malay", count: malay, fill: "var(--color-malay)" },
    { category: "Chinese", count: chinese, fill: "var(--color-chinese)" },
    { category: "Indian", count: indian, fill: "var(--color-indian)" },
    { category: "Orang Asli", count: orangAsli, fill: "var(--color-orangAsli)" },
    { category: "Non- Citizen", count: nonCitizen, fill: "var(--color-nonCitizen)" },
    { category: "Other", count: other, fill: "var(--color-other)" },
  ];

  const chartConfig = {
    malay: {
      label: "Malay",
      color: "var(--chart-5)",
    },
    chinese: {
      label: "Chinese",
      color: "var(--chart-5)",
    },
    indian: {
      label: "Indian",
      color: "var(--chart-5)",
    },
    orangAsli: {
      label: "Orang Asli",
      color: "var(--chart-5)",
    },
    nonCitizen: {
      label: "Non Citizen",
      color: "var(--chart-5)",
    },
    other: {
      label: "Other",
      color: "var(--chart-5)",
    },
  } satisfies ChartConfig;

  return (
    <ProportionalBarChart
      title={title}
      description={description}
      chartData={chartData}
      chartConfig={chartConfig}
      hideAxis
      vertical
    />
  );
}

function HRGenderChart({ data }: { data: HealthRoundBySubdistrict }) {
  const { male, female } = data.sex;
  const title = "Gender Distribution";
  const description = "Population breakdown by gender";

  const chartData = [
    { category: "male", count: male, fill: "var(--color-male)" },
    { category: "female", count: female, fill: "var(--color-female)" },
  ];

  const chartConfig = {
    male: {
      label: "Male",
      color: "var(--chart-2)",
    },
    female: {
      label: "Female",
      color: "var(--chart-1)",
    },
  } satisfies ChartConfig;

  return (
    <LabelledPieChart
      title={title}
      description={description}
      chartData={chartData}
      chartConfig={chartConfig}
      disableAnimation
    />
  );
}

export default function HealthRoundDemographics({ data }: { data: HealthRoundBySubdistrict }) {
  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-[1.5fr_1fr] gap-8 mb-8">
        <HRParticipantsStat data={data} />
        <HRMedianAgeStat data={data} />
      </div>
      <div className="mb-8">
        <HRAgeChart data={data} />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
        <HREthnicityChart data={data} />
        <HRGenderChart data={data} />
      </div>
    </div>
  );
}
