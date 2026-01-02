import { calcMeanAndStdDev, MapKey, MapValue } from "@/lib/summarise";
import { catMappings, numMappings, optCatMappings, responseMapping, scoreMapping, subdistrictMapping } from "./map";

// Type definition for Health Round CSV headers
type ColMappingKeys = MapKey<typeof catMappings>;
type OptMappingKeys = MapKey<typeof optCatMappings>;
type CategoryKeys = MapKey<typeof numMappings>;
type ScoreKeys = MapKey<typeof scoreMapping>;
export type Headers =
  | ColMappingKeys
  | OptMappingKeys
  | ScoreKeys
  | CategoryKeys
  | typeof subdistrictMapping.column
  | typeof responseMapping.column;

// Type definitions for summary results by subdistrict in Health Round CSVs
type ColMappingValue = MapValue<typeof catMappings>;
type OptMappingValue = MapValue<typeof optCatMappings>;
type NumMappingValue = MapValue<typeof numMappings>;

export type SummaryBySubdistrict = {
  [K in ColMappingValue["name"]]: Record<MapValue<Extract<ColMappingValue, { name: K }>["mapping"]>, number>;
} & {
  [K in OptMappingValue["name"]]?: Record<MapValue<Extract<OptMappingValue, { name: K }>["mapping"]>, number>;
} & {
  [K in NumMappingValue["name"]]: Record<MapValue<Extract<NumMappingValue, { name: K }>["thresholds"]>, number>;
} & {
  [K in MapValue<typeof scoreMapping>]: ReturnType<typeof calcMeanAndStdDev>;
} & {
  statistics: {
    participants: number;
  } & {
    [K in NumMappingValue["medianName"]]: number;
  };
};

// Type definition for summary data with all subdistricts and overall summary in Health Round CSVs
export type SummaryData = Record<MapValue<typeof subdistrictMapping.map> | "overall", SummaryBySubdistrict>;
