import { HealthRound } from "@/summary/health-round";
import { datasetMap, DatasetType } from "../types";

export { DatasetType };

export interface CSVFile {
  name: string;
  size: number;
  rows: number;
  columns: number;
  headers: string[];
  preview: string[][];
  summary: HealthRound;
  type: DatasetType;
  year: number;
}

export interface UploadStatus {
  type: "success" | "error" | null;
  message: string;
}

export const csvTypes = Array.from(datasetMap.entries()).map(([value, { name }]) => ({
  value: value.toString(),
  label: name,
}));