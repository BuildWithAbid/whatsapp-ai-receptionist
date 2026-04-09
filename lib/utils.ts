import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function compact<T>(items: Array<T | null | undefined | false>) {
  return items.filter(Boolean) as T[];
}

export function maskPhoneNumber(value?: string | null) {
  if (!value) {
    return "Not set";
  }

  if (value.length < 4) {
    return value;
  }

  return `${"*".repeat(Math.max(0, value.length - 4))}${value.slice(-4)}`;
}

export function formatCount(value: number) {
  return new Intl.NumberFormat("en-US", {
    maximumFractionDigits: 0,
  }).format(value);
}
