import quickselect from "quickselect";
import { numMappings, catMappings, optCatMappings, responseMapping, scoreMapping, subdistrictMapping } from "./map";

// Constants
const NA = "";
const TRUE = "1";

// Type definition for Health Round CSV headers
type MapKey<T> = T extends Map<infer K, any> ? K : never;
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
type ExtractMapValue<M> = M extends ReadonlyMap<any, infer V> ? V : never;
type ColMappingValue = ExtractMapValue<typeof catMappings>;

export type SummaryBySubdistrict = {
  [K in ColMappingValue["name"]]: Record<ExtractMapValue<Extract<ColMappingValue, { name: K }>["mapping"]>, number>;
} & {
  [K in ExtractMapValue<typeof optCatMappings>["name"]]?: Record<
    ExtractMapValue<Extract<ExtractMapValue<typeof optCatMappings>, { name: K }>["mapping"]>,
    number
  >;
} & {
  [K in ExtractMapValue<typeof numMappings>["name"]]: Record<
    ExtractMapValue<Extract<ExtractMapValue<typeof numMappings>, { name: K }>["thresholds"]>,
    number
  >;
} & {
  [K in ExtractMapValue<typeof scoreMapping>]: ReturnType<typeof calcMeanAndStdDev>;
} & {
  statistics: {
    participants: number;
  } & {
    [K in ExtractMapValue<typeof numMappings>["medianName"]]: number;
  };
};

// Type definition for summary data with all subdistricts and overall summary in Health Round CSVs
export type SummaryData = Record<ExtractMapValue<typeof subdistrictMapping.map> | "overall", SummaryBySubdistrict>;

/**
 * Transposes a 2D array. The CSV is tranposed to optimise column-wise operations and simplify the summarisation logic.
 *
 * @param a - The 2D array to transpose.
 * @returns The transposed 2D array.
 */
function transpose<T>(a: T[][]): T[][] {
  var w = a.length;
  var h = a[0].length;

  const t = Array(h);

  for (let i = 0; i < h; i++) {
    t[i] = Array(w);
    for (let j = 0; j < w; j++) {
      t[i][j] = a[j][i];
    }
  }

  return t;
}

/**
 * Creates a mapping from header names to their respective indices in the CSV data. The order of headers in the CSV is
 * not guaranteed, so this lookup table is necessary to correctly access column data by header name.
 *
 * @param arr - The array of header names from the CSV.
 * @returns A readonly map where keys are header names and values are their corresponding indices in the CSV data.
 */
export function createIndexMap(arr: Headers[]): ReadonlyMap<Headers, number> {
  const keyValuePairs = arr.map((value, index) => [value, index] as const);
  return new Map<Headers, number>(keyValuePairs);
}

/**
 * Helper function to get the size of a categorical mapping by finding the maximum key and adding one to account for
 * zero-based indexing.
 *
 * @param mapping - The categorical mapping.
 * @returns The size of the mapping.
 */
const getMapSize = (mapping: ReadonlyMap<number, string>) => {
  const keys = Array.from(mapping.keys());
  return Math.max(...keys) + 1;
};

/**
 * Helper function to calculate mean and standard deviation from summation, sum of squares, and count.
 *
 * @param summation - The sum of all values.
 * @param sumOfSquares - The sum of all squared values.
 * @param count - The number of values.
 * @returns An object containing the mean, standard deviation, summation, sum of squares, and count.
 */
const getMeanAndStdDev = (summation: number, sumOfSquares: number, count: number) => {
  const exactMean = summation / count;
  const variance = sumOfSquares / count - exactMean * exactMean;
  const unbiasedVariance = (count / (count - 1)) * variance;
  const exactStdDev = Math.sqrt(unbiasedVariance);
  const mean = Math.round(exactMean * 100) / 100;
  const stdDev = Math.round(exactStdDev * 100) / 100;
  return { mean, stdDev, summation, sumOfSquares, count };
};

/**
 * Tallies the number of times each category appears in the data. Uses an array of counts indexed by category key
 * instead of an object or map for efficient counting.
 *
 * @param data - The array of categorical values.
 * @param size - The size of the categorical mapping, which is the largest key + 1 to account for zero-based indexing.
 * @returns An array of counts for each category.
 */
const countOccurrences = (data: string[], size: number) => {
  const counts = new Array(size).fill(0); // Initialise counts array with zeros
  for (let i = 0, l = data.length; i < l; i++) {
    const value = data[i];
    if (value !== NA) counts[Number(value)]++; // Increment count for the category and ignore NA values
  }
  return counts;
};

/**
 * Calculates the mean and standard deviation for an array of numerical string values. In addition to mean and stdDev,
 * also outputs the summation, sum of squares, and count for efficient combination of overall statistics.
 * 
 * @param data - The array of numerical string values.
 * @returns An object containing the mean, standard deviation, summation, sum of squares, and count.
 */
const calcMeanAndStdDev = (data: string[]) => {
  let summation = 0;
  let sumOfSquares = 0;
  let count = 0;
  for (let i = 0, l = data.length; i < l; i++) {
    const value = data[i];
    // Adds the sum, sum of squares, and count while ignoring NA values
    if (value !== NA) { 
      const num = Number(value);
      summation += num;
      sumOfSquares += num * num;
      count++;
    }
  }
  // Uses helper function to calculate mean and stdDev from summation, sum of squares, and count
  return getMeanAndStdDev(summation, sumOfSquares, count);
};

/**
 * Calculates the median of an array of numbers using the Quickselect algorithm for efficiency.
 * 
 * @param nums - The array of numbers.
 * @returns The median of the array.
 */
const calcMedian = (nums: number[]) => {
  const n = nums.length;
  if (n === 0) return 0;

  // Finds the middle position and partitions the array in place into lower and upper halves
  const mid = Math.floor(n / 2); 
  quickselect(nums, mid);
  if (n % 2 === 1) {
    // If odd length, return the middle element
    return nums[mid];
  } else {
    // If even length, return the average of the two middle elements
    const leftMid = Math.max(...nums.slice(0, mid)); // Largest element in the lower half since mid is on the upper half
    return (leftMid + nums[mid]) / 2;
  }
};

/**
 * Summarises categorical data by counting occurrences of each category based on the provided mapping.
 * 
 * @param data - The array of categorical string values.
 * @param mapping - The mapping from category keys to descriptive names.
 * @returns An object where keys are descriptive category names and values are their respective counts.
 * @example
 * const data = ["0", "1", "0", "", "1", "1", ""];
 * const mapping = new Map([[0, "Male"], [1, "Female"]]);
 * const result = summarise(data, mapping); // { Male: 2, Female: 3 }
 */
const summariseCategorical = <K extends number, V extends string>(data: string[], mapping: ReadonlyMap<K, V>) => {
  const size = getMapSize(mapping);
  const counts = countOccurrences(data, size);

  // Map counts array back to descriptive category names
  const result = {} as Record<V, number>;
  for (const [key, value] of mapping) {
    result[value] = counts[key];
  }
  return result;
};

/**
 * Summarises numerical data into defined categories and collects numerical values for median calculation.
 * 
 * @param data - The array of numerical string values.
 * @param categories - The mapping from numerical thresholds to descriptive category names.
 * @returns An object containing the counts for each category and an array of numerical values.
 * @example
 * const data = ["1500", "2999", "3000", "4500", "", "6000", "7500", "5000", ""];
 * const categories = new Map([[0, "Low"], [3000, "Medium"], [5000, "High"]]);
 * const { result, nums } = summariseCategories(data, categories);
 * // result: { Low: 2, Medium: 2, High: 3 }
 * // nums: [1500, 2999, 3000, 4500, 6000, 7500, 5000]
 */
const summariseNumerical = <K extends number, V extends string>(data: string[], categories: ReadonlyMap<K, V>) => {
  const bracketLevels = Array.from(categories.keys()).sort((a, b) => a - b); // Sorted array of category thresholds
  const size = bracketLevels.length;
  const counts = new Array(size).fill(0); // Initialise counts array with zeros

  // Helper function to get the category index for a given numerical value
  const getCategoryIndex = (num: number): number => {
    for (let i = 0; i < size; i++) {
      if (num < bracketLevels[i]) return i - 1;
    }
    return size - 1;
  };

  const nums = [];
  for (let i = 0, l = data.length; i < l; i++) {
    const value = data[i];
    // Determine category index and increment count while collecting numerical values, ignoring NA values
    if (value !== NA) {
      const num = Number(value);
      counts[getCategoryIndex(num)]++;
      nums.push(num);
    }
  }

  // Map counts array back to descriptive category names
  const result: Record<V, number> = {} as Record<V, number>;
  let categoryIndex = 0;
  for (const [, label] of categories) {
    result[label] = counts[categoryIndex];
    categoryIndex++;
  }
  return { result, nums };
};

/**
 * Summarises data for a specific subdistrict by calculating categorical counts, category counts, and score statistics.
 * 
 * @param indexMap - A readonly map of header names to their respective indices in the CSV data.
 * @param data - The 2D array of Health Round CSV data rows for the subdistrict.
 * @returns An object containing the summary for the subdistrict and numerical values for median calculations.
 */
export const summariseBySubdistrict = (indexMap: ReadonlyMap<Headers, number>, data: string[][]) => {
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
    const { result, nums } = summariseNumerical(transposed[colIndex], value.thresholds);
    summary[value.name] = result;  
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
};

/**
 * Generates the overall summary from individual subdistrict summaries by combining categorical counts, median and score 
 * statistics.
 * 
 * @param summaries - An array of subdistrict summaries to combine.
 * @returns The combined overall summary.
 */
const combineSummaries = (summaries: ReturnType<typeof summariseBySubdistrict>[]): SummaryBySubdistrict => {
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
};

/**
 * Summarises the Health Round CSV data by subdistrict and overall.
 * 
 * @param headers - The array of header names from the CSV.
 * @param data - The 2D array of Health Round CSV data rows.
 * @returns An object containing the summary data by subdistrict and overall.
 */
export const summariseData = (headers: Headers[], data: string[][]) => {
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
};
