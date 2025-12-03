// Census response data
export const censusResponseData = [
  { category: "Agreed", count: 11594, fill: "var(--color-agreed)" },
  { category: "Refused", count: 603, fill: "var(--color-refused)" },
  { category: "Not at Home", count: 4382, fill: "var(--color-notAtHome)" },
  { category: "Unoccupied", count: 2192, fill: "var(--color-unoccupied)" },
];

// Ethnic composition data
export const ethnicData = [
  { category: "Malay", proportion: 62.5, fill: "var(--color-malay)" },
  { category: "Chinese", proportion: 25.9, fill: "var(--color-chinese)" },
  { category: "Indian", proportion: 8.4, fill: "var(--color-indian)" },
  { category: "Orang Asli", proportion: 2.3, fill: "var(--color-orangAsli)" },
];

// Gender distribution data
export const genderData = [
  { category: "male", proportion: 50.9, fill: "var(--color-male)" },
  { category: "female", proportion: 49.1, fill: "var(--color-female)" },
];

// Senior population data
export const seniorData = [
  { category: "senior", proportion: 13.5, fill: "var(--color-senior)" },
  { category: "nonSenior", proportion: 86.5, fill: "var(--color-nonSenior)" },
];

// Health - Chronic diseases data
export const chronicDiseasesData = [
  { category: "Hypertension", proportion: 29.1, fill: "var(--color-chart-1)" },
  { category: "Diabetes", proportion: 11.7, fill: "var(--color-chart-2)" },
  { category: "Heart Disease", proportion: 4.5, fill: "var(--color-chart-3)" },
  { category: "Stroke", proportion: 1.6, fill: "var(--color-chart-4)" },
  { category: "Arthritis", proportion: 5, fill: "var(--color-chart-5)" },
  { category: "Kidney Disease", proportion: 1.3, fill: "var(--color-chart-1)" },
  { category: "Cancer", proportion: 0.6, fill: "var(--color-chart-2)" },
];

// Number of chronic diseases by gender
export const chronicByGenderData = [
  { diseases: "0", male: 62.3, female: 58 },
  { diseases: "1", male: 15, female: 18 },
  { diseases: "2", male: 10, female: 12 },
  { diseases: "3", male: 5, female: 6 },
  { diseases: "4", male: 3, female: 3.5 },
  { diseases: "5+", male: 4.7, female: 2.5 },
];

// Economic - Employment status data
export const employmentData = [
  { category: "Employed", count: 60, fill: "var(--color-employed)" },
  { category: "Unemployed", count: 5, fill: "var(--color-unemployed)" },
  { category: "Student", count: 20, fill: "var(--color-student)" },
  { category: "Retired", count: 10, fill: "var(--color-retired)" },
  { category: "Homemaker", count: 5, fill: "var(--color-homemaker)" },
];

// Top 5 industries bubble data
export const industriesData = [
  { category: "Agriculture, forestry and fishing", proportion: 24.9, fill: "var(--color-chart-1)" },
  { category: "Wholesale and retail trade", proportion: 12.3, fill: "var(--color-chart-2)" },
  { category: "Accommodation & food services", proportion: 10.5, fill: "var(--color-chart-3)" },
  { category: "Manufacturing", proportion: 6.7, fill: "var(--color-chart-4)" },
  { category: "Education", proportion: 6.3, fill: "var(--color-chart-5)" },
];

// Household types data
export const householdData = [
  { category: "Nuclear family", proportion: 77.2, fill: "var(--color-nuclearFamily)" },
  { category: "Extended family", proportion: 21, fill: "var(--color-extendedFamily)" },
  { category: "Other types of sharing", proportion: 1.8, fill: "var(--color-other)" },
];

// Internet and TV data
export const internetTvData = [
  { category: "homeInternet", proportion: 16.8, fill: "var(--color-chart-4)" },
  { category: "satelliteTv", proportion: 61.3, fill: "var(--color-chart-1)" },
];

// Vehicle ownership data
export const vehicleData = [
  { category: "atLeastOneVehicle", proportion: 81.2, fill: "var(--color-atLeastOneVehicle)" },
  { category: "noVehicle", proportion: 18.8, fill: "var(--color-noVehicle)" },
];