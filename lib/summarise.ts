import { subdistrictMapping, colMappings, responseMapping, scores, optMappings, colCategories } from "./map";
import quickselect from "quickselect";

const NA = "";
const TRUE = "1";

type MapKey<T> = T extends Map<infer K, any> ? K : never;
type ExtractMapValue<M> = M extends ReadonlyMap<any, infer V> ? V : never;
type ColMappingValue = ExtractMapValue<typeof colMappings>;

export type SummaryBySubdistrict = {
  [K in ColMappingValue["name"]]: Record<ExtractMapValue<Extract<ColMappingValue, { name: K }>["mapping"]>, number>;
} & {
  [K in ExtractMapValue<typeof optMappings>["name"]]?: Record<
    ExtractMapValue<Extract<ExtractMapValue<typeof optMappings>, { name: K }>["mapping"]>,
    number
  >;
} & {
  [K in ExtractMapValue<typeof colCategories>["name"]]: Record<
    ExtractMapValue<Extract<ExtractMapValue<typeof colCategories>, { name: K }>["categories"]>,
    number
  >;
} & {
  [K in ExtractMapValue<typeof scores>]: ReturnType<typeof calcMeanAndStdDev>;
} & {
  statistics: {
    participants: number;
  } & {
    [K in ExtractMapValue<typeof colCategories>["medianName"]]: number;
  };
};

export type SummaryData = Record<ExtractMapValue<typeof subdistrictMapping.map> | "overall", SummaryBySubdistrict>;

type ColMappingKeys = MapKey<typeof colMappings>;
type OptMappingKeys = MapKey<typeof optMappings>;
type CategoryKeys = MapKey<typeof colCategories>;
type ScoreKeys = MapKey<typeof scores>;
export type Headers =
  | ColMappingKeys
  | OptMappingKeys
  | ScoreKeys
  | CategoryKeys
  | typeof subdistrictMapping.column
  | typeof responseMapping.column;

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

export function createIndexMap(arr: Headers[]): ReadonlyMap<Headers, number> {
  const keyValuePairs = arr.map((value, index) => [value, index] as const);
  return new Map<Headers, number>(keyValuePairs);
}

const getMapSize = (mapping: ReadonlyMap<number, string>) => {
  const keys = Array.from(mapping.keys());
  return Math.max(...keys) + 1;
};

const countOccurrences = (data: string[], size: number) => {
  const counts = new Array(size).fill(0);
  for (let i = 0, l = data.length; i < l; i++) {
    const value = data[i];
    if (value !== NA) counts[Number(value)]++;
  }
  return counts;
};

const calcMeanAndStdDev = (data: string[]) => {
  let summation = 0;
  let sumOfSquares = 0;
  let count = 0;
  for (let i = 0, l = data.length; i < l; i++) {
    const value = data[i];
    if (value !== NA) {
      const num = Number(value);
      summation += num;
      sumOfSquares += num * num;
      count++;
    }
  }
  const exactMean = summation / count;
  const variance = sumOfSquares / count - exactMean * exactMean;
  const unbiasedVariance = (count / (count - 1)) * variance;
  const exactStdDev = Math.sqrt(unbiasedVariance);
  const mean = Math.round(exactMean * 100) / 100;
  const stdDev = Math.round(exactStdDev * 100) / 100;
  return { mean, stdDev, summation, sumOfSquares, count };
};

const calcMedian = (nums: number[]) => {
  const n = nums.length;
  if (n === 0) return 0;
  const mid = Math.floor(n / 2);
  quickselect(nums, mid);
  if (n % 2 === 1) {
    return nums[mid];
  } else {
    const leftMid = Math.max(...nums.slice(0, mid));
    return (leftMid + nums[mid]) / 2;
  }
};

const summarise = <K extends number, V extends string>(data: string[], mapping: ReadonlyMap<K, V>) => {
  const size = getMapSize(mapping);
  const counts = countOccurrences(data, size);

  const result = {} as Record<V, number>;
  for (const [key, value] of mapping) {
    result[value] = counts[key];
  }
  return result;
};

const summariseCategories = <K extends number, V extends string>(data: string[], categories: ReadonlyMap<K, V>) => {
  const bracketLevels = Array.from(categories.keys()).sort((a, b) => a - b);
  const size = bracketLevels.length;
  const counts = new Array(size).fill(0);

  const getCategoryIndex = (num: number): number => {
    for (let i = 0; i < size; i++) {
      if (num < bracketLevels[i]) return i - 1;
    }
    return size - 1;
  };

  const nums = [];
  for (let i = 0, l = data.length; i < l; i++) {
    const value = data[i];
    if (value !== NA) {
      const num = Number(value);
      counts[getCategoryIndex(num)]++;
      nums.push(num);
    }
  }

  const result: Record<V, number> = {} as Record<V, number>;
  let categoryIndex = 0;
  for (const [, label] of categories) {
    result[label] = counts[categoryIndex];
    categoryIndex++;
  }
  return { result, nums };
};

export const summariseBySubdistrict = (indexMap: ReadonlyMap<Headers, number>, data: string[][]) => {
  const transposed = transpose(data);

  const summary = {} as SummaryBySubdistrict;
  summary.statistics = {} as SummaryBySubdistrict["statistics"];
  summary.statistics.participants = data.length;
  const medianNums = {} as Record<ExtractMapValue<typeof colCategories>["medianName"], number[]>;

  for (const [key, value] of colMappings) {
    const colIndex = indexMap.get(key)!;
    summary[value.name] = summarise(transposed[colIndex], value.mapping);
  }

  for (const [key, value] of optMappings) {
    const colIndex = indexMap.get(key);
    if (colIndex !== undefined) {
      summary[value.name] = summarise(transposed[colIndex], value.mapping);
    }
  }

  for (const [key, value] of colCategories) {
    const colIndex = indexMap.get(key)!;
    const { result, nums } = summariseCategories(transposed[colIndex], value.categories);
    summary[value.name] = result;
    summary.statistics[value.medianName] = calcMedian(nums);
    medianNums[value.medianName] = nums;
  }

  for (const [key, scoreName] of scores) {
    const colIndex = indexMap.get(key)!;
    const scoreData = transposed[colIndex];
    const scoreMeanStdDev = calcMeanAndStdDev(scoreData);
    summary[scoreName] = scoreMeanStdDev;
  }

  return { summary, medianNums };
};

const combineSummaries = (summaries: ReturnType<typeof summariseBySubdistrict>[]): SummaryBySubdistrict => {
  const combined = summaries[0].summary;

  for (let i = 1; i < summaries.length; i++) {
    const summary = summaries[i].summary;
    combined.statistics.participants += summary.statistics.participants;

    // Combine categorical counts
    for (const [, value] of colMappings) {
      const categoryName = value.name;
      const category = combined[categoryName] as Record<string, number>;
      for (const [key, value] of Object.entries(summary[categoryName])) {
        const k = key as keyof (typeof combined)[typeof categoryName];
        category[k] += value;
      }
    }

    // Combine optional categorical counts
    for (const [, value] of optMappings) {
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
    for (const [, value] of colCategories) {
      const categoryName = value.name;
      const category = combined[categoryName] as Record<string, number>;
      for (const [key, value] of Object.entries(summary[categoryName])) {
        const k = key as keyof (typeof combined)[typeof categoryName];
        category[k] += value;
      }
    }

    // Combine scores
    for (const [, scoreName] of scores) {
      const prevStats = combined[scoreName];
      const currStats = summary[scoreName];
      prevStats.summation += currStats.summation;
      prevStats.sumOfSquares += currStats.sumOfSquares;
      prevStats.count += currStats.count;
    }
  }

  // Finalise mean and stdDev calculations
  for (const [, scoreName] of scores) {
    const stats = combined[scoreName];
    const exactMean = stats.summation / stats.count;
    const variance = stats.sumOfSquares / stats.count - exactMean * exactMean;
    const unbiasedVariance = (stats.count / (stats.count - 1)) * variance;
    const exactStdDev = Math.sqrt(unbiasedVariance);
    stats.mean = Math.round(exactMean * 100) / 100;
    stats.stdDev = Math.round(exactStdDev * 100) / 100;
  }

  // Combine median calculations
  for (const [, value] of colCategories) {
    const medianName = value.medianName;
    const nums: number[] = [];
    for (const summary of summaries) {
      nums.push(...summary.medianNums[medianName]);
    }
    combined.statistics[medianName] = calcMedian(nums);
  }
  return combined;
};

export const summariseData = (headers: string[], data: string[][]) => {
  const { map: sdMap, column: sdCol } = subdistrictMapping;
  const { column: resCol } = responseMapping;

  const indexMap = createIndexMap(headers as Headers[]);
  const sdIndex = indexMap.get(sdCol)!;
  const resIndex = indexMap.get(resCol)!;

  const size = getMapSize(sdMap);
  const sdData = Array.from({ length: size }, () => <string[][]>[]);

  for (let i = 0, l = data.length; i < l; i++) {
    const row = data[i];
    if (row[resIndex] === TRUE) sdData[Number(row[sdIndex])].push(row);
  }

  const result = {} as SummaryData;
  const subdistrictSummaries: ReturnType<typeof summariseBySubdistrict>[] = [];

  for (const [id, name] of sdMap) {
    const res = summariseBySubdistrict(indexMap, sdData[id]);
    result[name] = res.summary;
    subdistrictSummaries.push(res);
  }
  result.overall = combineSummaries(subdistrictSummaries);
  return result;
};
