import { clsx, type ClassValue } from "clsx"
import { ReadonlyURLSearchParams } from "next/navigation";
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

export function createUrl(path: string, params: URLSearchParams | ReadonlyURLSearchParams): string {
  const paramsString = params.toString();
  const queryString = paramsString ? `?${paramsString}` : '';
  return `${path}${queryString}`;
}