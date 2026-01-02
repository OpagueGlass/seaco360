import { getHealthRoundData } from "@/lib/query";

export enum DatasetType {
  HealthRound = 1,
  Census,
}

export const datasetMap = new Map([
  [
    DatasetType.HealthRound,
    {
      name: "Health Round",
      variant: "default",
      getQueryOptions: (year: number) => ({
        queryKey: ["health-round", year],
        queryFn: () => getHealthRoundData(year).then((data) => data || {}),
        staleTime: Infinity,
      }),
    },
  ],
  [
    DatasetType.Census,
    {
      name: "Census",
      variant: "secondary",
      getQueryOptions: (year: number) => ({
        queryKey: ["census", year],
        queryFn: () => Promise.resolve({}),
        staleTime: Infinity,
      }),
    },
  ],
] as const);
