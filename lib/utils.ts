import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const classTypes = [
  { value: "CLASS_5", label: "Class 5" },
  { value: "CLASS_6", label: "Class 6" },
  { value: "CLASS_7", label: "Class 7" },
  { value: "CLASS_8", label: "Class 8" },
  { value: "CLASS_9", label: "Class 9" },
  { value: "CLASS_10", label: "Class 10" },
  { value: "SSC_PREP", label: "SSC Prep" },
  { value: "GK", label: "General Knowledge" },
];

