import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function ensureStartWith(url: string, prefix: string): string {
  if (url.startsWith(prefix)) {
    return url;
  }
  return `${prefix}${url}`;
}