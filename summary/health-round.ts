import { RecValue, summariseBy } from "@/lib/summarise";

/*
 * Mappings derived from the dataset codebook, with keys as the codes and values as descriptive labels. Codebook
 * mappings are marked with "as const" for immutability so that their maps can be used in type definitions.
 */

const response = [
  [1, "agreed"],
  [2, "unwilling"],
  [3, "notAtHome"],
  [4, "incapable"],
  [7, "moved"],
  [8, "passedAway"],
] as const;

const subdistrict = [
  [1, "bekok"],
  [2, "chaah"],
  [3, "gemereh"],
  [4, "jabi"],
  [5, "sgSegamat"],
] as const;

const sex = [
  [1, "male"],
  [2, "female"],
  [3, "other"],
] as const;

const ethnic = [
  [1, "malay"],
  [2, "chinese"],
  [3, "indian"],
  [4, "orangAsli"],
  [5, "other"],
  [6, "nonCitizen"],
] as const;

const education = [
  [1, "noFormalEducation"],
  [2, "primary"],
  [3, "secondary"],
  [4, "tertiary"],
  [5, "other"],
  [6, "doNotKnow"],
  [7, "refusedToAnswer"],
] as const;

const employment = [
  [2, "student"],
  [3, "homemaker"],
  [4, "notWorking"],
  [5, "working"],
  [10, "pensioner"],
  [11, "selfEmployed"],
] as const;

const bmiCategory = [
  [0, "underweight"],
  [1, "normal"],
  [2, "overweight"],
  [3, "obese"],
] as const;

const binaryOption = [
  [0, "no"],
  [1, "yes"],
] as const;

/*
 * Categorical mapping to group numerical values into descriptive ranges with thresholds.
 *
 * Keys are the thresholds, which are the lower bounds of each range, and values are the descriptive labels.
 * The smallest key must be equal to the minimum possible value in the dataset to ensure all values are categorised.
 *
 * Input for maps marked with "as const" for type definitions.
 */

const incomeBrackets = new Map([
  [0, "RM0-499"],
  [500, "RM500-999"],
  [1000, "RM1000-1499"],
  [1500, "RM1500-1999"],
  [2000, "RM2000+"],
] as const);

const ageCategories = new Map([
  [0, "0-4"],
  [5, "5-9"],
  [10, "10-14"],
  [15, "15-19"],
  [20, "20-24"],
  [25, "25-29"],
  [30, "30-34"],
  [35, "35-39"],
  [40, "40-44"],
  [45, "45-49"],
  [50, "50-54"],
  [55, "55-59"],
  [60, "60-64"],
  [65, "65-69"],
  [70, "70-74"],
  [75, "75-99"],
  [100, "100+"],
] as const);

/**
 * Contains the column name and mapping for response codes.
 */
export const responseMapping = {
  column: "status" as const,
  map: new Map(response),
};

/**
 * Contains the column name and mapping for subdistrict codes.
 */
export const subdistrictMapping = {
  column: "mukim" as const,
  map: new Map(subdistrict),
};

/**
 * Map with the necessary categorical columns for Health Round CSVs. All Health Round CSVs must contain these columns.
 *
 * Keys are the expected column names in the CSV file, and values are an object containing the descriptive name and
 * mapping for that column. The mapping is used to interpret the coded values in the dataset, while the name is used to
 * reference the result in the aggregated output.
 *
 * Input for maps marked with "as const" for type definitions.
 */
export const catMappings = new Map([
  ["sex", { name: "sex", mapping: new Map(sex) }],
  ["mcio", { name: "ethnicity", mapping: new Map(ethnic) }],
  ["edu", { name: "educationLevel", mapping: new Map(education) }],
  ["employstatus", { name: "employmentStatus", mapping: new Map(employment) }],
  ["heartdis", { name: "heartDisease", mapping: new Map(binaryOption) }],
  ["asthma", { name: "asthma", mapping: new Map(binaryOption) }],
  ["stroke", { name: "stroke", mapping: new Map(binaryOption) }],
  ["arthritis", { name: "arthritis", mapping: new Map(binaryOption) }],
  ["kidneydis", { name: "kidneyDisease", mapping: new Map(binaryOption) }],
  ["dengue", { name: "hadDengueBefore", mapping: new Map(binaryOption) }],
  ["denpastyear", { name: "hadDenguePastYear", mapping: new Map(binaryOption) }],
  ["uti", { name: "hadUTIPastYear", mapping: new Map(binaryOption) }],
  ["eversmoke", { name: "hadSmokeBefore", mapping: new Map(binaryOption) }],
  ["smoker", { name: "isCurrentlySmoking", mapping: new Map(binaryOption) }],
  ["bmicat_who", { name: "bmiCategory", mapping: new Map(bmiCategory) }],
  ["centralob", { name: "centralObesity", mapping: new Map(binaryOption) }],
  ["hpt_screened", { name: "hypertensionScreened", mapping: new Map(binaryOption) }],
  ["hpt_diagnosed", { name: "hypertensionDiagnosed", mapping: new Map(binaryOption) }],
  ["hpt_measured", { name: "hypertensionMeasured", mapping: new Map(binaryOption) }],
  ["dm_screened", { name: "diabetesScreened", mapping: new Map(binaryOption) }],
  ["dm_diagnosed", { name: "diabetesDiagnosed", mapping: new Map(binaryOption) }],
  ["dm_measured", { name: "diabetesMeasured", mapping: new Map(binaryOption) }],
] as const);

/**
 * Map with the necessary numerical columns for Health Round CSVs. All Health Round CSVs must contain these columns.
 *
 * Keys are the expected column names in the CSV file, and values are an object containing the descriptive name,
 * categories, and median name for that column. The categories mapping is used to group numerical values into ranges,
 * while the name is used to reference the result in the aggregated output. The medianName is used to reference the
 * median value for the numeric column.
 *
 * Input for maps marked with "as const" for type definitions.
 */
export const numMappings = new Map([
  ["income", { name: "income", thresholds: incomeBrackets, medianName: "medianIncome" }],
  ["age", { name: "age", thresholds: ageCategories, medianName: "medianAge" }],
] as const);

/**
 * Map with the domain and overall score columns for Health Round CSVs. All Health Round CSVs must contain these columns.
 *
 * Keys are the expected column names in the CSV file, and values are the corresponding descriptive names used to
 * reference the scores in the aggregated output. A mapping is not necessary since the mean and standard deviation can
 * be calculated directly from the numerical values.
 *
 * Input for maps marked with "as const" for type definitions.
 */
export const scoreMapping = new Map([
  ["dom1", "physicalHealth"],
  ["dom2", "psychologicalHealth"],
  ["dom3", "socialRelationships"],
  ["dom4", "environment"],
  ["overall", "overallQoL"],
] as const);

/**
 * Map with the optional columns for Health Round CSVs. Some Health Round CSVs may not contain these columns.
 *
 * Keys are the expected column names in the CSV file, and values are an object containing the descriptive name and
 * mapping for that column. The mapping is used to interpret the coded values in the dataset, while the name is used to
 * reference the result in the aggregated output.
 *
 * Input for maps marked with "as const" for type definitions.
 */
export const optCatMappings = new Map([
  ["dialysis", { name: "underDialysis", mapping: new Map(binaryOption) }],
  ["inadequate_fruits", { name: "inadequateFruit", mapping: new Map(binaryOption) }],
  ["inadequate_veg", { name: "inadequateVegetable", mapping: new Map(binaryOption) }],
] as const);

export function summariseHealthRound(headers: string[], data: string[][]) {
  return summariseBy(
    subdistrictMapping,
    responseMapping,
    catMappings,
    optCatMappings,
    numMappings,
    scoreMapping,
    headers,
    data
  );
}

export type HealthRound = ReturnType<typeof summariseHealthRound>
export type HealthRoundBySubdistrict = RecValue<HealthRound>