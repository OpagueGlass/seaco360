const ageCategory = new Map<number, string>([
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
]);

const sex = new Map<number, string>([
  [1, "male"],
  [2, "female"],
  [3, "other"],
]);

const ethnic = new Map<number, string>([
  [1, "malay"],
  [2, "chinese"],
  [3, "indian"],
  [4, "orangAsli"],
  [5, "other"],
  [6, "nonCitizen"],
]);

const education = new Map<number, string>([
  [1, "noFormalEducation"],
  [2, "primary"],
  [3, "secondary"],
  [4, "tertiary"],
  [5, "other"],
  [6, "doNotKnow"],
  [7, "refusedToAnswer"],
]);

const employment = new Map<number, string>([
  [2, "student"],
  [3, "homemaker"],
  [4, "notWorking"],
  [5, "working"],
  [10, "pensioner"],
  [11, "selfEmployed"],
]);

const bmiCategory = new Map<number, string>([
  [0, "underweight"],
  [1, "normal"],
  [2, "overweight"],
  [3, "obese"],
]);

const binaryOption = new Map<number, string>([
  [0, "no"],
  [1, "yes"],
]);

export const response: { column: number; map: ReadonlyMap<number, string> } = {
  column: 2,
  map: new Map<number, string>([
    [1, "agreed"],
    [2, "unwilling"],
    [3, "notAtHome"],
    [4, "incapable"],
    [7, "moved"],
    [8, "passedAway"],
  ]),
};

export const subdistrict: { column: number; map: ReadonlyMap<number, string> } = {
  column: 4,
  map: new Map<number, string>([
    [1, "bekok"],
    [2, "chaah"],
    [3, "gemereh"],
    [4, "jabi"],
    [5, "sgSegamat"],
  ]),
};

export const colMappings: ReadonlyMap<number, { name: string; mapping: ReadonlyMap<number, string> }> = new Map<
  number,
  { name: string; mapping: ReadonlyMap<number, string> }
>([
  [7, { name: "ageCategory", mapping: ageCategory }],
  [8, { name: "sex", mapping: sex }],
  [9, { name: "ethnicity", mapping: ethnic }],
  [10, { name: "educationLevel", mapping: education }],
  [11, { name: "employmentStatus", mapping: employment }],
  [18, { name: "underDialysis", mapping: binaryOption }],
  [19, { name: "hadDengueBefore", mapping: binaryOption }],
  [20, { name: "hadDenguePastYear", mapping: binaryOption }],
  [21, { name: "hadUTIPastYear", mapping: binaryOption }],
  [22, { name: "hadSmokeBefore", mapping: binaryOption }],
  [23, { name: "isCurrentlySmoking", mapping: binaryOption }],
  [24, { name: "inadequateFruit", mapping: binaryOption }],
  [25, { name: "inadequateVegetable", mapping: binaryOption }],
  [27, { name: "bmiCategory", mapping: bmiCategory }],
  [28, { name: "centralObesity", mapping: binaryOption }],
]);

export const chronicDiseases: { name: string; mapping: ReadonlyMap<number, string> } = {
  name: "chronicDiseases",
  mapping: new Map<number, string>([
    [13, "heartDisease"],
    [14, "asthma"],
    [15, "stroke"],
    [16, "arthritis"],
    [17, "kidneyDisease"],
    [36, "hypertension"],
    [51, "diabetes"],
  ]),
};

export const scores: ReadonlyMap<number, string> = new Map<number, string>([
  [57, "physicalHealth"],
  [58, "psychologicalHealth"],
  [59, "socialRelationships"],
  [60, "environment"],
  [61, "overallQoL"],
]);

const incomeBrackets: ReadonlyMap<number, string> = new Map<number, string>([
  [0, "RM0-499"],
  [500, "RM500-999"],
  [1000, "RM1000-1499"],
  [1500, "RM1500-1999"],
  [2000, "RM2000+"],
]);

export const income = { column: 12, brackets: incomeBrackets, name: "income" };
  