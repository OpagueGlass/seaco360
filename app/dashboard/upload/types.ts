import { SummaryData } from "@/summary/health-round/types";
import { datasetMap, DatasetType } from "../types";

export { DatasetType };

export interface CSVFile {
  name: string;
  size: number;
  rows: number;
  columns: number;
  headers: string[];
  preview: string[][];
  summary: SummaryData;
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