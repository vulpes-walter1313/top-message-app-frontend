import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...args: ClassValue[]) {
  return twMerge(clsx(args));
}

export function getBackendUrl() {
  if (import.meta.env.PROD) {
    return import.meta.env.VITE_PROD_BACKEND_URL!;
  } else {
    return import.meta.env.VITE_DEV_BACKEND_URL!;
  }
}