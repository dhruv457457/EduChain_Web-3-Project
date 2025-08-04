import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * A utility function to conditionally join class names together and merge Tailwind CSS classes
 * without style conflicts.
 * @param {...(string|Object|Array<string|Object>)} inputs - The class names to combine.
 * @returns {string} The merged and optimized class name string.
 */
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}