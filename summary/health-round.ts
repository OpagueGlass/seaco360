import { RecValue, summariseBy } from "@/lib/summarise";

/*
 * Maps derived from the dataset codebook, with keys as the codes and values as descriptive labels. Codebook maps are 
 * marked with "as const" for immutability so that their maps can be used in type definitions.
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
 * Categorical maps to group numerical values into descriptive ranges with thresholds.
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
 * Contains the column name and map for response codes.
 */
const responseMapping = {
  name: "status",
  map: new Map(response),
} as const

/**
 * Contains the column name and map for subdistrict codes.
 */
const subdistrictMapping = {
  name: "mukim",
  map: new Map(subdistrict),
} as const;

/**
 * Mapping with the necessary categorical columns for Health Round CSVs. All Health Round CSVs must contain these 
 * columns.
 *
 * Keys are the expected column names in the CSV file, and values are an object containing the descriptive name and
 * map for that column. The map is used to interpret the coded values in the dataset, while the name is used to
 * reference the result in the aggregated output.
 *
 * Input for maps marked with "as const" for type definitions.
 */
const catMappings = new Map([
  ["sex", { name: "sex", map: new Map(sex) }],
  ["mcio", { name: "ethnicity", map: new Map(ethnic) }],
  ["edu", { name: "educationLevel", map: new Map(education) }],
  ["employstatus", { name: "employmentStatus", map: new Map(employment) }],
  ["heartdis", { name: "heartDisease", map: new Map(binaryOption) }],
  ["asthma", { name: "asthma", map: new Map(binaryOption) }],
  ["stroke", { name: "stroke", map: new Map(binaryOption) }],
  ["arthritis", { name: "arthritis", map: new Map(binaryOption) }],
  ["kidneydis", { name: "kidneyDisease", map: new Map(binaryOption) }],
  ["dengue", { name: "hadDengueBefore", map: new Map(binaryOption) }],
  ["denpastyear", { name: "hadDenguePastYear", map: new Map(binaryOption) }],
  ["uti", { name: "hadUTIPastYear", map: new Map(binaryOption) }],
  ["eversmoke", { name: "hadSmokeBefore", map: new Map(binaryOption) }],
  ["smoker", { name: "isCurrentlySmoking", map: new Map(binaryOption) }],
  ["bmicat_who", { name: "bmiCategory", map: new Map(bmiCategory) }],
  ["centralob", { name: "centralObesity", map: new Map(binaryOption) }],
  ["hpt_screened", { name: "hypertensionScreened", map: new Map(binaryOption) }],
  ["hpt_diagnosed", { name: "hypertensionDiagnosed", map: new Map(binaryOption) }],
  ["hpt_measured", { name: "hypertensionMeasured", map: new Map(binaryOption) }],
  ["dm_screened", { name: "diabetesScreened", map: new Map(binaryOption) }],
  ["dm_diagnosed", { name: "diabetesDiagnosed", map: new Map(binaryOption) }],
  ["dm_measured", { name: "diabetesMeasured", map: new Map(binaryOption) }],
] as const);

/**
 * Mapping with the necessary numerical columns for Health Round CSVs. All Health Round CSVs must contain these columns.
 *
 * Keys are the expected column names in the CSV file, and values are an object containing the descriptive name,
 * categories, and median name for that column. The categories map is used to group numerical values into ranges,
 * while the name is used to reference the result in the aggregated output. The medianName is used to reference the
 * median value for the numeric column.
 *
 * Input for maps marked with "as const" for type definitions.
 */
const numMappings = new Map([
  ["income", { name: "income", thresholds: incomeBrackets, medianName: "medianIncome" }],
  ["age", { name: "age", thresholds: ageCategories, medianName: "medianAge" }],
] as const);

/**
 * Mapping with the domain and overall score columns for Health Round CSVs. All Health Round CSVs must contain these columns.
 *
 * Keys are the expected column names in the CSV file, and values are the corresponding descriptive names used to
 * reference the scores in the aggregated output. Maps are not necessary since the mean and standard deviation can
 * be calculated directly from the numerical values.
 *
 * Input for maps marked with "as const" for type definitions.
 */
const scoreMappings = new Map([
  ["dom1", "physicalHealth"],
  ["dom2", "psychologicalHealth"],
  ["dom3", "socialRelationships"],
  ["dom4", "environment"],
  ["overall", "overallQoL"],
] as const);

/**
 * Mapping with the optional columns for Health Round CSVs. Some Health Round CSVs may not contain these columns.
 *
 * Keys are the expected column names in the CSV file, and values are an object containing the descriptive name and
 * map for that column. The map is used to interpret the coded values in the dataset, while the name is used to
 * reference the result in the aggregated output.
 *
 * Input for maps marked with "as const" for type definitions.
 */
const optCatMappings = new Map([
  ["dialysis", { name: "underDialysis", map: new Map(binaryOption) }],
  ["inadequate_fruits", { name: "inadequateFruit", map: new Map(binaryOption) }],
  ["inadequate_veg", { name: "inadequateVegetable", map: new Map(binaryOption) }],
] as const);

export function summariseHealthRound(headers: string[], data: string[][]) {
  return summariseBy(
    subdistrictMapping,
    responseMapping,
    catMappings,
    optCatMappings,
    numMappings,
    scoreMappings,
    headers,
    data
  );
}

export type HealthRound = ReturnType<typeof summariseHealthRound>
export type HealthRoundBySubdistrict = RecValue<HealthRound>