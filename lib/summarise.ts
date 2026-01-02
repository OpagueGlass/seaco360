import quickselect from "quickselect";

// Constants
export const NA = "";
export const TRUE = "1";

// Types
export type MapKey<T> = T extends Map<infer K, any> ? K : never;
export type ExtractMapValue<M> = M extends ReadonlyMap<any, infer V> ? V : never;

/**
 * Transposes a 2D array. The CSV is tranposed to optimise column-wise operations and simplify the summarisation logic.
 *
 * @param a - The 2D array to transpose.
 * @returns The transposed 2D array.
 */
export function transpose<T>(a: T[][]): T[][] {
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
export function createIndexMap<K extends string>(arr: K[]): ReadonlyMap<K, number> {
  const keyValuePairs = arr.map((value, index) => [value, index] as const);
  return new Map<K, number>(keyValuePairs);
}

/**
 * Helper function to get the size of a categorical mapping by finding the maximum key and adding one to account for
 * zero-based indexing.
 *
 * @param mapping - The categorical mapping.
 * @returns The size of the mapping.
 */
export function getMapSize(mapping: ReadonlyMap<number, string>) {
  const keys = Array.from(mapping.keys());
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
export function countOccurrences(data: string[], size: number) {
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
export function getMeanAndStdDev(summation: number, sumOfSquares: number, count: number) {
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
export function calcMeanAndStdDev(data: string[]) {
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
 * Calculates the median of an array of numbers using the Quickselect algorithm instead of sorting for efficiency.
 *
 * @param nums - The array of numbers to partition in place and find the median from.
 * @returns The median of the array.
 */
export function calcMedian(nums: number[]) {
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
 * @param mapping - The mapping from category keys to descriptive names.
 * @returns An object where keys are descriptive category names and values are their respective counts.
 * @example
 * const data = ["0", "1", "0", "", "1", "1", ""];
 * const mapping = new Map([[0, "Male"], [1, "Female"]]);
 * const result = summarise(data, mapping); // { Male: 2, Female: 3 }
 */
export function summariseCategorical<K extends number, V extends string>(data: string[], mapping: ReadonlyMap<K, V>) {
  const size = getMapSize(mapping);
  const counts = countOccurrences(data, size);

  // Map counts array back to descriptive category names
  const result = {} as Record<V, number>;
  for (const [key, value] of mapping) {
    result[value] = counts[key];
  }
  return result;
}

/**
 * Summarises numerical data into defined categories and optionally collects numerical values for median calculation.
 *
 * @param data - The array of numerical string values.
 * @param thresholds - The mapping from numerical thresholds to descriptive category names.
 * @param numsOut - An optional array to collect numerical values for median calculation.
 * @returns An object containing the counts for each category.
 */
export function summariseNumerical<K extends number, V extends string>(
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
