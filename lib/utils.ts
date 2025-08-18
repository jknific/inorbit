import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Helper function to add base path to asset URLs
export function assetPath(path: string): string {
  // With custom domain, no base path needed
  return path
}