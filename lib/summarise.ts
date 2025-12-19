import { subdistrict, colMappings, response, chronicDiseases, scores, income } from "./map";

const NA = "";
const TRUE = "1";

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
  return { mean, stdDev };
};

const summarise = (data: string[], mapping: ReadonlyMap<number, string>) => {
  const size = getMapSize(mapping);
  const counts = countOccurrences(data, size);

  const result = {} as { [key: string]: number };
  for (const [key, value] of mapping) {
    result[value] = counts[key];
  }
  return result;
};

const summariseChronicDisease = (data: string[][]) => {
  const result = {} as { [key: string]: number };
  for (const [key, disease] of chronicDiseases.mapping) {
    const diseaseData = data[key];
    result[disease] = countTrueValues(diseaseData);
  }
  return result;
};

const summariseIncome = (data: string[], brackets: ReadonlyMap<number, string>) => {
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

  const result = {} as { [key: string]: number };
  let bracketIndex = 0;
  for (const [, label] of brackets) {
    result[label] = counts[bracketIndex];
    bracketIndex++;
  }
  return result;
};

const summariseBySubdistrict = (data: string[][]) => {
  const transposed = transpose(data);

  const summary: { [key: string]: { [key: string]: number } } = {};
  for (const [key, value] of colMappings) {
    summary[value.name] = summarise(transposed[key], value.mapping);
  }
  summary[chronicDiseases.name] = summariseChronicDisease(transposed);

  for (const [key, scoreName] of scores) {
    const scoreData = transposed[key];
    const scoreMeanStdDev = calcMeanAndStdDev(scoreData);
    summary[scoreName] = scoreMeanStdDev;
  }
  summary[income.name] = summariseIncome(transposed[income.column], income.brackets);
  return summary;
};

export const summariseData = (data: string[][]) => {
  const { map: sdMap, column: sdCol } = subdistrict;
  const { column: resCol } = response;

  const size = getMapSize(sdMap);
  const sdData = Array.from({ length: size }, () => <string[][]>[]);

  for (let i = 0, l = data.length; i < l; i++) {
    const row = data[i];
    if (row[resCol] === TRUE) sdData[Number(row[sdCol])].push(row);
  }

  const result: { [key: string]: { [key: string]: { [key: string]: number } } } = {};
  for (const [id, name] of sdMap) {
    result[name] = summariseBySubdistrict(sdData[id]);
  }
  return result;
};
