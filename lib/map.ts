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
  column: 2,
  map: new Map(response),
};

export const subdistrictMapping = {
  column: 4,
  map: new Map(subdistrict),
};

export const colMappings = new Map([
  [7, { name: "ageCategory", mapping: new Map(ageCategory) }],
  [8, { name: "sex", mapping: new Map(sex) }],
  [9, { name: "ethnicity", mapping: new Map(ethnic) }],
  [10, { name: "educationLevel", mapping: new Map(education) }],
  [11, { name: "employmentStatus", mapping: new Map(employment) }],
  [18, { name: "underDialysis", mapping: new Map(binaryOption) }],
  [19, { name: "hadDengueBefore", mapping: new Map(binaryOption) }],
  [20, { name: "hadDenguePastYear", mapping: new Map(binaryOption) }],
  [21, { name: "hadUTIPastYear", mapping: new Map(binaryOption) }],
  [22, { name: "hadSmokeBefore", mapping: new Map(binaryOption) }],
  [23, { name: "isCurrentlySmoking", mapping: new Map(binaryOption) }],
  [24, { name: "inadequateFruit", mapping: new Map(binaryOption) }],
  [25, { name: "inadequateVegetable", mapping: new Map(binaryOption) }],
  [27, { name: "bmiCategory", mapping: new Map(bmiCategory) }],
  [28, { name: "centralObesity", mapping: new Map(binaryOption) }],
] as const);

export const chronicDiseases = {
  name: "chronicDiseases",
  mapping: new Map([
    [13, "heartDisease"],
    [14, "asthma"],
    [15, "stroke"],
    [16, "arthritis"],
    [17, "kidneyDisease"],
    [36, "hypertension"],
    [51, "diabetes"],
  ] as const),
};

export const scores = new Map([
  [57, "physicalHealth"],
  [58, "psychologicalHealth"],
  [59, "socialRelationships"],
  [60, "environment"],
  [61, "overallQoL"],
] as const);

const incomeBrackets = new Map([
  [0, "RM0-499"],
  [500, "RM500-999"],
  [1000, "RM1000-1499"],
  [1500, "RM1500-1999"],
  [2000, "RM2000+"],
] as const);

export const income = { column: 12, brackets: incomeBrackets, name: "income" };
