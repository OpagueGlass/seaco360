import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
/*
  Helper function to assign a color to data based on its index
*/
export function colourIndex<T>(data: T, index: number) {
  return {
    ...data,
    fill: `var(--chart-${(index % 5) + 1})`,
  }
}