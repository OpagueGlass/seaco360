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

const ageCategory = [
  [0, "0-4"],
  [1, "5-9"],
  [2, "10-14"],
  [3, "15-19"],
  [4, "20-24"],
  [5, "25-29"],
  [6, "30-34"],
  [7, "35-39"],
  [8, "40-44"],
  [9, "45-49"],
  [10, "50-54"],
  [11, "55-59"],
  [12, "60-64"],
  [13, "65-69"],
  [14, "70-74"],
  [15, "75-99"],
  [16, "100+"],
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

export const responseMapping = {
  column: "status" as const,
  map: new Map(response),
};

export const subdistrictMapping = {
  column: "mukim" as const,
  map: new Map(subdistrict),
};

export const colMappings = new Map([
  ["agecat", { name: "ageCategory", mapping: new Map(ageCategory) }],
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

export const optMappings = new Map([
  ["dialysis", { name: "underDialysis", mapping: new Map(binaryOption) }],
  ["inadequate_fruits", { name: "inadequateFruit", mapping: new Map(binaryOption) }],
  ["inadequate_veg", { name: "inadequateVegetable", mapping: new Map(binaryOption) }],
] as const);

export const scores = new Map([
  ["dom1", "physicalHealth"],
  ["dom2", "psychologicalHealth"],
  ["dom3", "socialRelationships"],
  ["dom4", "environment"],
  ["overall", "overallQoL"],
] as const);

const incomeBrackets = new Map([
  [0, "RM0-499"],
  [500, "RM500-999"],
  [1000, "RM1000-1499"],
  [1500, "RM1500-1999"],
  [2000, "RM2000+"],
] as const);

export const income = { column: "income" as const, brackets: incomeBrackets };
