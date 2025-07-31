// lib/utils.ts

/**
 * Class name utility: intelligently joins Tailwind class names
 * Filters out falsy values (null, undefined, false, etc.)
 */
export function cn(...inputs: (string | undefined | null | false)[]): string {
  return inputs.filter(Boolean).join(" ");
}
