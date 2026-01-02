import { supabase } from "./supabase";
import { SummaryData } from "./summarise";

export const ERROR = -1;

export async function getHealthRoundYears() {
  const { data, error } = await supabase.from("health_rounds").select("year").order("year", { ascending: false });

  if (error) {
    console.error("Error fetching health round years:", error);
    return [];
  }

  return data.map((row) => row.year);
}

export async function getHealthRoundData(year: number): Promise<SummaryData | null> {
  const { data, error } = await supabase.from("health_rounds").select("data").eq("year", year).single();

  if (error) {
    console.error(`Error fetching health round data for year ${year}:`, error);
    return null;
  }

  return data?.data as SummaryData;
}

export async function addHealthRoundData(year: number, data: SummaryData) {
  const { error } = await supabase.from("health_rounds").insert({ year, data });

  if (error) {
    console.error(`Error saving health round data for year ${year}:`, error);
    return ERROR;
  }

  return year;
}

export async function deleteHealthRoundData(year: number) {
  const { error } = await supabase.from("health_rounds").delete().eq("year", year);
  
  if (error) {
    console.error(`Error deleting health round data for year ${year}:`, error);
    return ERROR;
  }

  return year;
}
