import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty";
import { Spinner } from "@/components/ui/spinner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChartSpline, ClipboardList, HeartPulse, Stethoscope, Users } from "lucide-react";
import { SummaryData } from "../../../lib/summarise";
import HealthRoundDemographics from "./hr-demo";
import HealthRoundDiseases from "./hr-diseases";
import HealthRoundEconomic from "./hr-econ";
import HealthRoundHealth from "./hr-health";
import HealthRoundScores from "./hr-scores";
import { subdistricts } from "./page";

const healthRoundCategories = [
  { key: "demographics", label: "Demographics", icon: Users, content: HealthRoundDemographics },
  { key: "economic", label: "Economic", icon: ChartSpline, content: HealthRoundEconomic },
  { key: "health", label: "Health", icon: HeartPulse, content: HealthRoundHealth },
  { key: "diseases", label: "Diseases", icon: Stethoscope, content: HealthRoundDiseases },
  { key: "scores", label: "Scores", icon: ClipboardList, content: HealthRoundScores },
];

function ChartsLoading() {
  return (
    <div className="flex items-center justify-center w-full min-h-[40vh]">
      <Empty>
        <EmptyMedia>
          <Spinner className="size-12 text-primary" />
        </EmptyMedia>
        <EmptyHeader>
          <EmptyTitle>Loading</EmptyTitle>
          <EmptyDescription>Please wait while chart data is being loaded...</EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <div className="flex justify-center gap-1">
            <span className="size-2 bg-primary/60 rounded-full animate-bounce [animation-delay:-0.3s]" />
            <span className="size-2 bg-primary/60 rounded-full animate-bounce [animation-delay:-0.15s]" />
            <span className="size-2 bg-primary/60 rounded-full animate-bounce" />
          </div>
        </EmptyContent>
      </Empty>
    </div>
  );
}

function ChartsContent({
  data,
  subdistrict,
}: {
  data: SummaryData;
  subdistrict: (typeof subdistricts)[number]["key"];
}) {
  const subdistrictData = data[subdistrict];

  return (
    <>
      {healthRoundCategories.map((category) => (
        <TabsContent key={category.key} value={category.key} className="mt-6">
          <category.content data={subdistrictData} />
        </TabsContent>
      ))}
    </>
  );
}

export default function HealthRoundCharts({
  data,
  subdistrict,
}: {
  data: SummaryData | null | undefined;
  subdistrict: (typeof subdistricts)[number]["key"];
}) {
  return (
    <Tabs defaultValue={healthRoundCategories[0].key} className="w-full">
      <TabsList className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 h-auto">
        {healthRoundCategories.map((category) => (
          <TabsTrigger key={category.key} value={category.key} className="flex flex-col lg:flex-row items-center gap-2">
            <category.icon className="w-5 h-5" />
            <span>{category.label}</span>
          </TabsTrigger>
        ))}
      </TabsList>
      {data ? <ChartsContent data={data} subdistrict={subdistrict} /> : <ChartsLoading />}
    </Tabs>
  );
}
