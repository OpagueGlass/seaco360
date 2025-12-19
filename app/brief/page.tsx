"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Users, BarChart2, HeartPulse, PieChart } from "lucide-react";
import DemoComponent from "./demo";
import EconComponent from "./econ";
import HealthComponent from "./health";

export default function Page() {
  return (
    <div className="container p-6 mx-auto">
      <h1 className="text-3xl font-bold mb-6 flex items-center gap-2">Community Briefs</h1>

      <Tabs defaultValue="demographics" className="w-full">
        <TabsList className="grid grid-cols-3 h-full max-w-md">
          <TabsTrigger value="demographics" className="flex flex-col sm:flex-row items-center gap-2">
            <Users className="w-5 h-5" />
            <span>Demographics</span>
          </TabsTrigger>
          <TabsTrigger value="economic" className="flex flex-col sm:flex-row items-center gap-2">
            <BarChart2 className="w-5 h-5" />
            <span>Economic</span>
          </TabsTrigger>
          <TabsTrigger value="health" className="flex flex-col sm:flex-row items-center gap-2">
            <HeartPulse className="w-5 h-5" />
            <span>Health</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="demographics" className="mt-6">
          <DemoComponent />
        </TabsContent>

        <TabsContent value="economic" className="mt-6">
          <EconComponent />
        </TabsContent>

        <TabsContent value="health" className="mt-6">
          <HealthComponent />
        </TabsContent>
      </Tabs>
    </div>
  );
}
