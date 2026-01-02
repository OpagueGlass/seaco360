import {
  calcMeanAndStdDev,
  calcMedian,
  createIndexMap,
  ExtractMapValue,
  getMapSize,
  getMeanAndStdDev,
  MapKey,
  summariseCategorical,
  summariseNumerical,
  transpose,
  TRUE,
} from "@/lib/summarise";
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
type ColMappingValue = ExtractMapValue<typeof catMappings>;
type OptMappingValue = ExtractMapValue<typeof optCatMappings>;
type NumMappingValue = ExtractMapValue<typeof numMappings>;

export type SummaryBySubdistrict = {
  [K in ColMappingValue["name"]]: Record<ExtractMapValue<Extract<ColMappingValue, { name: K }>["mapping"]>, number>;
} & {
  [K in OptMappingValue["name"]]?: Record<ExtractMapValue<Extract<OptMappingValue, { name: K }>["mapping"]>, number>;
} & {
  [K in NumMappingValue["name"]]: Record<ExtractMapValue<Extract<NumMappingValue, { name: K }>["thresholds"]>, number>;
} & {
  [K in ExtractMapValue<typeof scoreMapping>]: ReturnType<typeof calcMeanAndStdDev>;
} & {
  statistics: {
    participants: number;
  } & {
    [K in NumMappingValue["medianName"]]: number;
  };
};

// Type definition for summary data with all subdistricts and overall summary in Health Round CSVs
export type SummaryData = Record<ExtractMapValue<typeof subdistrictMapping.map> | "overall", SummaryBySubdistrict>;

/**
 * Summarises data for a specific subdistrict by calculating categorical counts, category counts, and score statistics.
 *
 * @param indexMap - A readonly map of header names to their respective indices in the CSV data.
 * @param data - The 2D array of Health Round CSV data rows for the subdistrict.
 * @returns An object containing the summary for the subdistrict and numerical values for median calculations.
 */
function summariseBySubdistrict(indexMap: ReadonlyMap<Headers, number>, data: string[][]) {
  const transposed = transpose(data); // Transpose data for column-wise operations

  const summary = {} as SummaryBySubdistrict;
  summary.statistics = {} as SummaryBySubdistrict["statistics"];
  summary.statistics.participants = data.length; // Total number of participants in the subdistrict
  const medianNums = {} as Record<ExtractMapValue<typeof numMappings>["medianName"], number[]>;

  // Summarise necessary categorical columns
  for (const [key, value] of catMappings) {
    const colIndex = indexMap.get(key)!;
    summary[value.name] = summariseCategorical(transposed[colIndex], value.mapping);
  }

  // Summarise optional categorical columns if they exist in the CSV
  for (const [key, value] of optCatMappings) {
    const colIndex = indexMap.get(key);
    if (colIndex !== undefined) {
      summary[value.name] = summariseCategorical(transposed[colIndex], value.mapping);
    }
  }

  // Summarise necessary numerical columns
  for (const [key, value] of numMappings) {
    const colIndex = indexMap.get(key)!;
    const nums = [] as number[];
    summary[value.name] = summariseNumerical(transposed[colIndex], value.thresholds, nums);
    summary.statistics[value.medianName] = calcMedian(nums); // Calculate and store median for the numerical column
    medianNums[value.medianName] = nums; // Store numerical values for overall median calculation
  }

  // Summarise scores
  for (const [key, scoreName] of scoreMapping) {
    const colIndex = indexMap.get(key)!;
    const scoreData = transposed[colIndex];
    const scoreMeanStdDev = calcMeanAndStdDev(scoreData);
    summary[scoreName] = scoreMeanStdDev;
  }

  return { summary, medianNums };
}

/**
 * Generates the overall summary from individual subdistrict summaries by combining categorical counts, median and score
 * statistics. Instead of recalculating from raw data, it efficiently merges already computed summaries.
 *
 * @param summaries - An array of subdistrict summaries to combine.
 * @returns The combined overall summary.
 */
function combineSummaries(summaries: ReturnType<typeof summariseBySubdistrict>[]) {
  if (summaries.length === 0) return {} as SummaryBySubdistrict;
  if (summaries.length === 1) return summaries[0].summary;

  // Deep copy the first summary to avoid mutating original data
  const combined = JSON.parse(JSON.stringify(summaries[0].summary)) as SummaryBySubdistrict;

  for (let i = 1; i < summaries.length; i++) {
    const summary = summaries[i].summary;
    combined.statistics.participants += summary.statistics.participants;

    // Combine categorical counts
    for (const [, value] of catMappings) {
      const categoryName = value.name;
      const category = combined[categoryName] as Record<string, number>;
      for (const [key, value] of Object.entries(summary[categoryName])) {
        const k = key as keyof (typeof combined)[typeof categoryName];
        category[k] += value;
      }
    }

    // Combine optional categorical counts
    for (const [, value] of optCatMappings) {
      const categoryName = value.name;
      const category = combined[categoryName] as Record<string, number> | undefined;
      if (category) {
        for (const [key, value] of Object.entries(summary[categoryName]!)) {
          const k = key as keyof (typeof combined)[typeof categoryName];
          category[k] += value;
        }
      }
    }

    // Combine category counts
    for (const [, value] of numMappings) {
      const categoryName = value.name;
      const category = combined[categoryName] as Record<string, number>;
      for (const [key, value] of Object.entries(summary[categoryName])) {
        const k = key as keyof (typeof combined)[typeof categoryName];
        category[k] += value;
      }
    }

    // Combine scores
    for (const [, scoreName] of scoreMapping) {
      const prevStats = combined[scoreName];
      const currStats = summary[scoreName];
      prevStats.summation += currStats.summation;
      prevStats.sumOfSquares += currStats.sumOfSquares;
      prevStats.count += currStats.count;
    }
  }

  // Finalise mean and stdDev calculations
  for (const [, scoreName] of scoreMapping) {
    const stats = combined[scoreName];
    combined[scoreName] = getMeanAndStdDev(stats.summation, stats.sumOfSquares, stats.count);
  }

  // Find medians of numerical columns
  for (const [, value] of numMappings) {
    const medianName = value.medianName;
    const nums: number[] = [];
    for (const summary of summaries) {
      nums.push(...summary.medianNums[medianName]); // Collect all numerical values from subdistricts
    }
    combined.statistics[medianName] = calcMedian(nums); // Calculate and store overall median
  }
  return combined;
}

/**
 * Summarises the Health Round CSV data by subdistrict and overall.
 *
 * @param headers - The array of header names from the CSV.
 * @param data - The 2D array of Health Round CSV data rows.
 * @returns An object containing the summary data by subdistrict and overall.
 */
export function summariseData(headers: Headers[], data: string[][]) {
  const { map: sdMap, column: sdCol } = subdistrictMapping;
  const { column: resCol } = responseMapping;

  // Create index map for header lookups
  const indexMap = createIndexMap(headers as Headers[]);
  const sdIndex = indexMap.get(sdCol)!;
  const resIndex = indexMap.get(resCol)!;

  const size = getMapSize(sdMap);
  const sdData = Array.from({ length: size }, () => <string[][]>[]);

  // Filter by agreed responses and group data by subdistrict
  for (let i = 0, l = data.length; i < l; i++) {
    const row = data[i];
    if (row[resIndex] === TRUE) sdData[Number(row[sdIndex])].push(row);
  }

  const result = {} as SummaryData;
  const subdistrictSummaries: ReturnType<typeof summariseBySubdistrict>[] = [];

  // Summarise each subdistrict and store results
  for (const [id, name] of sdMap) {
    const res = summariseBySubdistrict(indexMap, sdData[id]);
    result[name] = res.summary;
    subdistrictSummaries.push(res);
  }

  // Combine subdistrict summaries to get overall summary
  result.overall = combineSummaries(subdistrictSummaries);
  return result;
}
