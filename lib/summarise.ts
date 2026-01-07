import quickselect from "quickselect";

// Constants
const NA = "";
const TRUE = "1";
const binaryOption = new Map([
  [0, "no"],
  [1, "yes"],
] as const);

// Types
type MapKey<T> = T extends Map<infer K, unknown> ? K : never;
type MapValue<M> = M extends ReadonlyMap<unknown, infer V> ? V : never;
export type RecValue<T> = T[keyof T];

/**
 * Transposes a matrix. The CSV is tranposed to optimise column-wise operations and simplify the summarisation logic.
 *
 * @param a - The matrix to transpose.
 * @returns The transposed matrix.
 */
function transpose<T>(a: T[][]): T[][] {
  const w = a.length;
  const h = a[0].length;

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
function createIndexMap<K extends string>(arr: K[]): ReadonlyMap<K, number> {
  const keyValuePairs = arr.map((value, index) => [value, index] as const);
  return new Map<K, number>(keyValuePairs);
}

/**
 * Helper function to get the size of a categorical mapping by finding the maximum key and adding one to account for
 * zero-based indexing.
 *
 * @param map - The categorical mapping.
 * @returns The size of the mapping.
 */
function getMapSize(map: ReadonlyMap<number, string>) {
  const keys = Array.from(map.keys());
  return Math.max(...keys) + 1;
}

/**
 * Tallies the number of times each category appears in the data. Uses an array of counts indexed by category key
 * instead of an object or map for efficient counting.
 *
 * @param data - The array of categorical values.
 * @param size - The size of the categorical mapping, which is the largest key + 1 to account for zero-based indexing.
 * @returns An array of counts for each category.
 */
function countOccurrences(data: string[], size: number) {
  const counts = new Array(size).fill(0); // Initialise counts array with zeros
  for (let i = 0, l = data.length; i < l; i++) {
    const value = data[i];
    if (value !== NA) counts[Number(value)]++; // Increment count for the category and ignore NA values
  }
  return counts;
}

/**
 * Helper function to calculate mean and standard deviation from summation, sum of squares, and count.
 *
 * @param summation - The sum of all values.
 * @param sumOfSquares - The sum of all squared values.
 * @param count - The number of values.
 * @returns An object containing the mean, standard deviation, summation, sum of squares, and count.
 */
function getMeanAndStdDev(summation: number, sumOfSquares: number, count: number) {
  const exactMean = summation / count;
  const variance = sumOfSquares / count - exactMean * exactMean;
  const unbiasedVariance = (count / (count - 1)) * variance;
  const exactStdDev = Math.sqrt(unbiasedVariance);
  const mean = Math.round(exactMean * 100) / 100;
  const stdDev = Math.round(exactStdDev * 100) / 100;
  return { mean, stdDev, summation, sumOfSquares, count };
}

/**
 * Calculates the mean and standard deviation for an array of numerical string values. In addition to mean and stdDev,
 * also outputs the summation, sum of squares, and count for efficient combination of overall statistics.
 *
 * @param data - The array of numerical string values.
 * @returns An object containing the mean, standard deviation, summation, sum of squares, and count.
 */
function calcMeanAndStdDev(data: string[]) {
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
}

/**
 * Calculates the median of an array of numbers. Uses the Quickselect algorithm instead of sorting for efficiency.
 *
 * @param nums - The array of numbers to partition in place and find the median from.
 * @returns The median of the array.
 */
function calcMedian(nums: number[]) {
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
}

/**
 * Summarises categorical data by counting occurrences of each category based on the provided mapping.
 *
 * @param data - The array of categorical string values.
 * @param map - The mapping from category keys to descriptive names.
 * @returns An object where keys are descriptive category names and values are their respective counts.
 * @example
 * const data = ["0", "1", "0", "", "1", "1", ""];
 * const map = new Map([[0, "No"], [1, "Yes"]] as const);
 * const result = summariseCategorical(data, map); // { No: 2, Yes: 3 }
 */
function summariseCategorical<K extends number, V extends string>(data: string[], map: ReadonlyMap<K, V>) {
  const size = getMapSize(map);
  const counts = countOccurrences(data, size);

  // Map counts array back to descriptive category names
  const result = {} as Record<V, number>;
  for (const [key, value] of map) {
    result[value] = counts[key];
  }
  return result;
}

/**
 * Summarises numerical data into defined categories and optionally collects numerical values for median calculation.
 *
 * @param data - The array of numerical string values.
 * @param thresholds - The map from numerical thresholds to descriptive category names. Thresholds must start from the
 * minimum to include all numbers in the data
 * @param numsOut - An optional array to collect numerical values for median calculation.
 * @returns An object containing the counts for each category.
 * @example
 * const data = ["1499", "500", "", "1500", "1800", "2000", "8000", "5000", ""]
 * const thresholds = new Map([[0, "RM0-1499"], [1500, "RM1500-1999"], [2000, "RM2000+"]] as const);
 * const nums = []
 * const result = summariseNumerical(data, thresholds, nums);
 * // result: { RM0-1499: 2, RM1500-1999: 2, RM2000+: 3 }
 * // nums = [1499, 500, 1500, 1800, 2000, 8000, 5000]
 */
function summariseNumerical<K extends number, V extends string>(
  data: string[],
  thresholds: ReadonlyMap<K, V>,
  numsOut?: number[]
) {
  const bracketLevels = Array.from(thresholds.keys()).sort((a, b) => a - b); // Sorted array of category thresholds
  const size = bracketLevels.length;
  const counts = new Array(size).fill(0); // Initialise counts array with zeros

  // Helper function to get the category index for a given numerical value
  function getCategoryIndex(num: number): number {
    for (let i = 0; i < size; i++) {
      if (num < bracketLevels[i]) return i - 1;
    }
    return size - 1;
  }

  for (let i = 0, l = data.length; i < l; i++) {
    const value = data[i];
    // Determine category index and increment count while optionally collecting numerical values, ignoring NA values
    if (value !== NA) {
      const num = Number(value);
      counts[getCategoryIndex(num)]++;
      numsOut?.push(num);
    }
  }

  // Map counts array back to descriptive category names
  const result: Record<V, number> = {} as Record<V, number>;
  let categoryIndex = 0;
  for (const [, label] of thresholds) {
    result[label] = counts[categoryIndex];
    categoryIndex++;
  }
  return result;
}

/**
 * Summarises all necessary categories with {@link summariseCategorical}, storing the result with the given name.
 *
 * @param catMappings - Finds the number of times each category appears in the columns with {@link summariseCategorical}
 * - Keys are the expected column names in the CSV file, and values are an object containing the descriptive name and
 * map for that column.
 * - The name is used to reference this result in the aggregated output, while the map is used to count the occurrences
 * and interpret the coded values in the dataset.
 * - Input for the map must be marked with **as const** for type support.
 * @param indexMap - The index map created from {@link createIndexMap}
 * @param transposed - The transposed dataset CSV
 * @returns The result object containing the given names as keys and summarised categories as values.
 */
function summariseCategories<
  CatKey extends string,
  CatValue extends Readonly<{ name: string; map: ReadonlyMap<number, string> }>
>(catMappings: ReadonlyMap<CatKey, CatValue>, indexMap: ReadonlyMap<CatKey, number>, transposed: string[][]) {
  const result = {} as { [K in CatValue["name"]]: Record<MapValue<Extract<CatValue, { name: K }>["map"]>, number> };

  for (const [key, { name, map }] of catMappings) {
    const colIndex = indexMap.get(key);
    if (colIndex !== undefined) {
      result[name as CatValue["name"]] = summariseCategorical(transposed[colIndex], map);
    }
  }

  return result;
}

/**
 * Summarises all optional categories with {@link summariseCategorical} if it exists, storing the result with the
 * given name.
 *
 * @param optCatMappings - Finds the number of times each category appears in the column with
 * {@link summariseCategorical}, if it exists.
 * - Keys are the expected column names in the CSV file, and values are an object containing the descriptive name and
 * map for that column.
 * - The name is used to reference this result in the aggregated output, while the map is used to to count the
 * occurences and interpret the coded values in the dataset.
 * - Input for the map must be marked with **as const** for type support.
 * @param indexMap - The index map created from {@link createIndexMap}
 * @param transposed - The transposed dataset CSV
 * @returns The result object containing the given names as keys and summarised categories as values
 */
function summariseOptionalCategories<
  OptKey extends string,
  OptValue extends Readonly<{ name: string; map: ReadonlyMap<number, string> }>
>(optCatMappings: ReadonlyMap<OptKey, OptValue>, indexMap: ReadonlyMap<OptKey, number>, transposed: string[][]) {
  const result = {} as { [K in OptValue["name"]]?: Record<MapValue<Extract<OptValue, { name: K }>["map"]>, number> };

  for (const [key, { name, map }] of optCatMappings) {
    const colIndex = indexMap.get(key);
    if (colIndex !== undefined) {
      result[name as OptValue["name"]] = summariseCategorical(transposed[colIndex], map);
    }
  }

  return result;
}

/**
 * Summarises all numerical columns with {@link summariseNumerical}, storing the result with the given name.
 *
 * @param numMappings - Finds the number of times each group in the threshold appears in that column with
 * {@link summariseNumerical}, and calculates the median value for that column in {@link getStatistics}.
 * - Keys are the expected column names in the CSV file, and values are an object containing the descriptive name,
 * median name, and thresholds map for that column.
 * - The thresholds map is used to group numerical values into ranges and count their occurences, while the name is used
 * to reference this result in the aggregated output. The medianName is used to reference the median value for the
 * numeric column.
 * - Input for the map must be marked with **as const** for type support.
 * @param indexMap - The index map created from {@link createIndexMap}
 * @param transposed - The transposed dataset CSV
 * @returns The result object containing the given names as keys and summarised groups and median nums as values
 */
function summariseNums<
  NumKey extends string,
  NumValue extends Readonly<{ name: string; medianName: string; thresholds: ReadonlyMap<number, string> }>
>(numMappings: ReadonlyMap<NumKey, NumValue>, indexMap: ReadonlyMap<NumKey, number>, transposed: string[][]) {
  const numsSummary = {} as {
    [K in NumValue["name"]]: Record<MapValue<Extract<NumValue, { name: K }>["thresholds"]>, number>;
  };
  const medianNums = new Map<NumValue["medianName"], number[]>();

  // Summarise necessary numerical columns
  for (const [key, { name, medianName, thresholds }] of numMappings) {
    const colIndex = indexMap.get(key)!;
    const nums = [] as number[];
    numsSummary[name as NumValue["name"]] = summariseNumerical(transposed[colIndex], thresholds, nums);
    medianNums.set(medianName, nums); // Store numerical values for overall median calculation
  }

  return { numsSummary, medianNums };
}

/**
 * Finds the mean and standard deviation of all score columns with {@link calcMeanAndStdDev}, storing the result with
 * the given name.
 *
 * @param scoreMapping - Finds the mean and standard deviation for the columns with {@link calcMeanAndStdDev}.
 * - Keys are the expected column names in the CSV file, and values are the corresponding descriptive names used to
 * reference the scores in the aggregated output. A map is not necessary since the mean and standard deviation can
 * be calculated directly from the numerical values.
 * - Input for the map must be marked with **as const** for type support.
 * @param indexMap - The index map created from {@link createIndexMap}
 * @param transposed - The transposed dataset CSV
 * @returns The result object containing the given name as keys and the associated mean and standard deviation as values
 */
function summariseScores<ScoreKey extends string, ScoreValue extends string>(
  scoreMapping: ReadonlyMap<ScoreKey, ScoreValue>,
  indexMap: ReadonlyMap<ScoreKey, number>,
  transposed: string[][]
) {
  const result = {} as Record<ScoreValue, ReturnType<typeof calcMeanAndStdDev>>;

  for (const [key, scoreName] of scoreMapping) {
    const colIndex = indexMap.get(key)!;
    const scoreData = transposed[colIndex];
    const scoreMeanStdDev = calcMeanAndStdDev(scoreData);
    result[scoreName] = scoreMeanStdDev;
  }

  return result;
}

/**
 * Obtains the size of the dataset and median of numerical columns
 *
 * @param medianNums - The medianNums map from {@link summariseNums}
 * @param data - The dataset CSV matrix
 * @returns The result object containing the given name and participants as keys and the associated number as values
 */
function getStatistics<
  NumValue extends Readonly<{ name: string; medianName: string; thresholds: ReadonlyMap<number, string> }>
>(medianNums: ReadonlyMap<NumValue["medianName"], number[]>, data: string[][]) {
  const result = {} as Record<NumValue["medianName"] | "participants", number>;
  result.participants = data.length;

  // Calculate and store median for numerical columns
  for (const [key, value] of medianNums) {
    result[key] = calcMedian(value);
  }

  return result;
}

/**
 * Summarises data by calculating categorical counts, category counts, and score statistics.
 *
 * @param catMappings - Map with the **necessary categorical columns** for the dataset CSVs. **All dataset CSVs must
 * contain these columns**. Refer to {@link summariseCategories}
 * @param optCatMappings
 * - Map with the **optional categorical columns** for the dataset CSVs. **Some CSVs may not contain these columns**.
 * Refer to {@link summariseOptionalCategories}
 * @param numMappings
 * - Map with the **necessary numerical columns** for the dataset CSVs. **All dataset CSVs must contain these columns**.
 * Refer to {@link summariseNums} and {@link getStatistics}
 * @param scoreMappings
 * - Map with the **score columns** for the dataset CSVs. **All dataset CSVs must contain these columns.** Refer to
 * {@link summariseScores}
 * @param headers - The array of header names from the CSV.
 * @param data - The matrix of data rows and columns from the CSV.
 * @param indexMap - The index map created from {@link createIndexMap}
 * @returns An object containing the summary and numerical values for median calculations.
 */
function summarise<
  CatKey extends string,
  CatValue extends Readonly<{ name: string; map: ReadonlyMap<number, string> }>,
  OptKey extends string,
  OptValue extends Readonly<{ name: string; map: ReadonlyMap<number, string> }>,
  NumKey extends string,
  NumValue extends Readonly<{ name: string; medianName: string; thresholds: ReadonlyMap<number, string> }>,
  ScoreKey extends string,
  ScoreValue extends string
>(
  catMappings: ReadonlyMap<CatKey, CatValue>,
  optCatMappings: ReadonlyMap<OptKey, OptValue>,
  numMappings: ReadonlyMap<NumKey, NumValue>,
  scoreMappings: ReadonlyMap<ScoreKey, ScoreValue>,
  indexMap: ReadonlyMap<string, number>,
  data: string[][]
) {
  const transposed = transpose(data); // Transpose data for column-wise operations

  const { numsSummary, medianNums } = summariseNums(numMappings, indexMap, transposed);

  const summary = {
    ...summariseCategories(catMappings, indexMap, transposed),
    ...summariseOptionalCategories(optCatMappings, indexMap, transposed),
    ...numsSummary,
    ...summariseScores(scoreMappings, indexMap, transposed),
    statistics: getStatistics(medianNums, data),
  };

  return { summary, medianNums };
}

/**
 * Generates the overall summary from individual summaries by combining categorical counts, median and score
 * statistics. Efficiently merges already computed summaries instead of recalculating from raw data.
 *
 * @param catMappings - Map with the **necessary categorical columns** for the dataset CSVs. **All dataset CSVs must
 * contain these columns**. Refer to {@link summariseCategories}
 * @param optCatMappings
 * - Map with the **optional categorical columns** for the dataset CSVs. **Some CSVs may not contain these columns**.
 * Refer to {@link summariseOptionalCategories}
 * @param numMappings
 * - Map with the **necessary numerical columns** for the dataset CSVs. **All dataset CSVs must contain these columns**.
 * Refer to {@link summariseNums} and {@link getStatistics}
 * @param scoreMappings
 * - Map with the **score columns** for the dataset CSVs. **All dataset CSVs must contain these columns.** Refer to
 * {@link summariseScores}
 * @param summaries - An array of summaries to combine.
 * @returns The combined overall summary.
 */
function combineSummaries<
  CatKey extends string,
  CatValue extends Readonly<{ name: string; map: ReadonlyMap<number, string> }>,
  OptKey extends string,
  OptValue extends Readonly<{ name: string; map: ReadonlyMap<number, string> }>,
  NumKey extends string,
  NumValue extends Readonly<{ name: string; medianName: string; thresholds: ReadonlyMap<number, string> }>,
  ScoreKey extends string,
  ScoreValue extends string
>(
  catMappings: ReadonlyMap<CatKey, CatValue>,
  optCatMappings: ReadonlyMap<OptKey, OptValue>,
  numMappings: ReadonlyMap<NumKey, NumValue>,
  scoreMappings: ReadonlyMap<ScoreKey, ScoreValue>,
  summaries: ReturnType<typeof summarise<CatKey, CatValue, OptKey, OptValue, NumKey, NumValue, ScoreKey, ScoreValue>>[]
) {
  type SummaryType = ReturnType<
    typeof summarise<CatKey, CatValue, OptKey, OptValue, NumKey, NumValue, ScoreKey, ScoreValue>
  >["summary"];
  if (summaries.length === 0) return {} as SummaryType;
  if (summaries.length === 1) return summaries[0].summary;

  // Deep copy the first summary to avoid mutating original data
  const combined = JSON.parse(JSON.stringify(summaries[0].summary)) as Record<string, Record<string, number>>;
  for (let i = 1; i < summaries.length; i++) {
    const summary = summaries[i].summary;
    combined.statistics.participants += summary.statistics.participants;

    // Combine categorical counts
    for (const [, value] of catMappings) {
      const categoryName = value.name as CatValue["name"];
      const category = combined[categoryName] as Record<string, number>;
      for (const [key, value] of Object.entries(summary[categoryName])) {
        const k = key as keyof (typeof combined)[typeof categoryName];
        category[k] += value;
      }
    }

    // Combine optional categorical counts
    for (const [, value] of optCatMappings) {
      const categoryName = value.name as OptValue["name"];
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
      const categoryName = value.name as NumValue["name"];
      const category = combined[categoryName] as Record<string, number>;
      for (const [key, value] of Object.entries(summary[categoryName])) {
        const k = key as keyof (typeof combined)[typeof categoryName];
        category[k] += value;
      }
    }

    // Combine scores
    for (const [, scoreName] of scoreMappings) {
      const prevStats = combined[scoreName];
      const currStats = summary[scoreName];
      prevStats.summation += currStats.summation;
      prevStats.sumOfSquares += currStats.sumOfSquares;
      prevStats.count += currStats.count;
    }
  }

  // Finalise mean and stdDev calculations
  for (const [, scoreName] of scoreMappings) {
    const stats = combined[scoreName];
    combined[scoreName] = getMeanAndStdDev(stats.summation, stats.sumOfSquares, stats.count);
  }

  // Find medians of numerical columns
  for (const [, value] of numMappings) {
    const medianName = value.medianName as NumValue["medianName"];
    const nums: number[] = [];
    for (const summary of summaries) {
      nums.push(...summary.medianNums.get(medianName)!); // Collect all numerical values from subdistricts
    }
    combined.statistics[medianName] = calcMedian(nums); // Calculate and store overall median
  }
  return combined as SummaryType;
}

/**
 * Summarises the CSV data by subdistrict and overall.
 *
 * @param subdistrictMapping - An object containing the column name and map for response codes.
 * @param responseMapping - An object containing the column name and map for subdistrict codes.
 * @param catMappings - Map with the **necessary categorical columns** for the dataset CSVs. **All dataset CSVs must
 * contain these columns**. Refer to {@link summariseCategories}
 * @param optCatMappings
 * - Map with the **optional categorical columns** for the dataset CSVs. **Some CSVs may not contain these columns**.
 * Refer to {@link summariseOptionalCategories}
 * @param numMappings
 * - Map with the **necessary numerical columns** for the dataset CSVs. **All dataset CSVs must contain these columns**.
 * Refer to {@link summariseNums} and {@link getStatistics}
 * @param scoreMappings
 * - Map with the **score columns** for the dataset CSVs. **All dataset CSVs must contain these columns.** Refer to
 * {@link summariseScores}
 * @param headers - The array of header names from the CSV.
 * @param data - The matrix of data rows and columns from the CSV.
 * @returns An object containing the summary data, separated by subdistrict with overall summary.
 *
 * @example
 * const subdistrictMapping = { name: "mukim", map: new Map(subdistrict)} as const;
 * const responseMapping = { name: "status", map: new Map(response)} as const
 * const catMappings = new Map([["sex", { name: "sex", map: new Map(sex) }]] as const) // Marking input as const
 * const optCatMappings = new Map([["dialysis", { name: "underDialysis", map: new Map(binaryOption) }]] as const)
 * const numMappings = new Map([["income", { name: "income", thresholds: incomeBrackets, medianName: "medianIncome" }]] as const)
 * const scoreMappings = new Map([["dom1", "physicalHealth"]] as const)
 *
 * export function summariseHealthRound(headers: string[], data: string[][]) {
 *   return summariseBy(subdistrictMapping, responseMapping, catMappings, optCatMappings, numMappings, scoreMappings, headers, data);
 * }
 * export type HealthRound = ReturnType<typeof summariseHealthRound>
 * export type HealthRoundBySubdistrict = RecValue<HealthRound>
 */
function summariseBy<
  Sub extends Readonly<{ map: ReadonlyMap<number, string>; name: string }>,
  Res extends Readonly<{ name: string }>,
  CatKey extends string,
  CatValue extends Readonly<{ name: string; map: ReadonlyMap<number, string> }>,
  OptKey extends string,
  OptValue extends Readonly<{ name: string; map: ReadonlyMap<number, string> }>,
  NumKey extends string,
  NumValue extends Readonly<{ name: string; medianName: string; thresholds: ReadonlyMap<number, string> }>,
  ScoreKey extends string,
  ScoreValue extends string
>(
  subdistrictMapping: Sub,
  responseMapping: Res,
  catMappings: ReadonlyMap<CatKey, CatValue>,
  optCatMappings: ReadonlyMap<OptKey, OptValue> = new Map([] as const),
  numMappings: ReadonlyMap<NumKey, NumValue>,
  scoreMappings: ReadonlyMap<ScoreKey, ScoreValue>,
  headers: string[],
  data: string[][]
) {
  const { map: sdMap, name: sdCol } = subdistrictMapping;
  const { name: resCol } = responseMapping;

  // Create index map for header lookups
  const indexMap = createIndexMap(headers);
  const sdIndex = indexMap.get(sdCol)!;
  const resIndex = indexMap.get(resCol)!;

  const size = getMapSize(sdMap);
  const sdData = Array.from({ length: size }, () => <string[][]>[]);

  // Filter by agreed responses and group data by subdistrict
  for (let i = 0, l = data.length; i < l; i++) {
    const row = data[i];
    if (row[resIndex] === TRUE) sdData[Number(row[sdIndex])].push(row);
  }

  type SummariseType = ReturnType<
    typeof summarise<CatKey, CatValue, OptKey, OptValue, NumKey, NumValue, ScoreKey, ScoreValue>
  >;

  const result = {} as Record<MapValue<Sub["map"]> | "overall", SummariseType["summary"]>;
  const subdistrictSummaries: SummariseType[] = [];

  // Summarise each subdistrict and store results
  for (const [id, name] of sdMap) {
    const res = summarise(catMappings, optCatMappings, numMappings, scoreMappings, indexMap, sdData[id]);
    const mapName = name as MapValue<Sub["map"]>;
    result[mapName] = res.summary;
    subdistrictSummaries.push(res);
  }
  // Combine subdistrict summaries to get overall summary
  result.overall = combineSummaries(catMappings, optCatMappings, numMappings, scoreMappings, subdistrictSummaries);
  return result;
}

export { binaryOption, summariseBy };

