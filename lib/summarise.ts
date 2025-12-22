import { subdistrictMapping, colMappings, responseMapping, chronicDiseases, scores, income } from "./map";

const NA = "";
const TRUE = "1";

type ExtractMapValue<M> = M extends ReadonlyMap<any, infer V> ? V : never;
type ColMappingValue = ExtractMapValue<typeof colMappings>;

export type SummaryBySubdistrict = & {
  [K in ColMappingValue["name"]]: Record<ExtractMapValue<Extract<ColMappingValue, { name: K }>["mapping"]>, number>;
} & {
  chronicDiseases: Record<ExtractMapValue<typeof chronicDiseases.mapping>, number>;
} & {
  [K in ExtractMapValue<typeof scores>]: ReturnType<typeof calcMeanAndStdDev>;
} & {
  income: Record<ExtractMapValue<typeof income.brackets>, number>;
};

export type SummaryData = Record<ExtractMapValue<typeof subdistrictMapping.map> | "overall", SummaryBySubdistrict>;

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

const countTrueValues = (data: string[]) => {
  let total = 0;
  for (let i = 0, l = data.length; i < l; i++) {
    if (data[i] === TRUE) total++;
  }
  return total;
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

const summarise = <K extends number, V extends string>(data: string[], mapping: ReadonlyMap<K, V>) => {
  const size = getMapSize(mapping);
  const counts = countOccurrences(data, size);

  const result = {} as Record<V, number>;
  for (const [key, value] of mapping) {
    result[value] = counts[key];
  }
  return result;
};

const summariseChronicDisease = <K extends number, V extends string>(data: string[][], mapping: ReadonlyMap<K, V>) => {
  const result = {} as Record<V, number>;
  for (const [key, disease] of mapping) {
    const diseaseData = data[key];
    result[disease] = countTrueValues(diseaseData);
  }
  return result;
};

const summariseIncome = <K extends number, V extends string>(data: string[], brackets: ReadonlyMap<K, V>) => {
  const bracketLevels = Array.from(brackets.keys()).sort((a, b) => a - b);
  const size = bracketLevels.length;
  const counts = new Array(size).fill(0);

  const getBracketIndex = (value: string): number => {
    const num = Number(value);
    for (let i = 0; i < size; i++) {
      if (num < bracketLevels[i]) return i - 1;
    }
    return size - 1;
  };

  for (let i = 0, l = data.length; i < l; i++) {
    const value = data[i];
    if (value !== NA) counts[getBracketIndex(value)]++;
  }

  const result: Record<V, number> = {} as Record<V, number>;
  let bracketIndex = 0;
  for (const [, label] of brackets) {
    result[label] = counts[bracketIndex];
    bracketIndex++;
  }
  return result;
};

const summariseBySubdistrict = (data: string[][]) => {
  const transposed = transpose(data);

  const summary = {} as SummaryBySubdistrict;
  for (const [key, value] of colMappings) {
    summary[value.name] = summarise(transposed[key], value.mapping);
  }
  summary.chronicDiseases = summariseChronicDisease(transposed, chronicDiseases.mapping);

  for (const [key, scoreName] of scores) {
    const scoreData = transposed[key];
    const scoreMeanStdDev = calcMeanAndStdDev(scoreData);
    summary[scoreName] = scoreMeanStdDev;
  }
  summary.income = summariseIncome(transposed[income.column], income.brackets);
  return summary;
};

const combineSummaries = (summaries: SummaryBySubdistrict[]): SummaryBySubdistrict => {
  if (summaries.length === 0) return {} as SummaryBySubdistrict;
  if (summaries.length === 1) return summaries[0];

  const combined = JSON.parse(JSON.stringify(summaries[0])) as SummaryBySubdistrict;

  for (let i = 1; i < summaries.length; i++) {
    const summary = summaries[i];

    // Combine categorical counts
    for (const [, value] of colMappings) {
      const categoryName = value.name;
      const category = combined[categoryName] as Record<string, number>;
      for (const [key, value] of Object.entries(summary[categoryName])) {
        const k = key as keyof (typeof combined)[typeof categoryName];
        category[k] += value;
      }
    }

    // Combine chronic diseases
    for (const [key, value] of Object.entries(summary.chronicDiseases)) {
      const k = key as keyof (typeof combined)["chronicDiseases"];
      combined.chronicDiseases[k] += value;
    }

    // Combine income brackets
    for (const [key, value] of Object.entries(summary.income)) {
      const k = key as keyof (typeof combined)["income"];
      combined.income[k] += value;
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

  return combined;
};

export const summariseData = (data: string[][]) => {
  const { map: sdMap, column: sdCol } = subdistrictMapping;
  const { column: resCol } = responseMapping;

  const size = getMapSize(sdMap);
  const sdData = Array.from({ length: size }, () => <string[][]>[]);

  for (let i = 0, l = data.length; i < l; i++) {
    const row = data[i];
    if (row[resCol] === TRUE) sdData[Number(row[sdCol])].push(row);
  }

  const result = {} as SummaryData;
  const subdistrictSummaries: SummaryBySubdistrict[] = [];

  for (const [id, name] of sdMap) {
    const summary = summariseBySubdistrict(sdData[id]);
    result[name] = summary;
    subdistrictSummaries.push(summary);
  }
  result.overall = combineSummaries(subdistrictSummaries);
  return result;
};
