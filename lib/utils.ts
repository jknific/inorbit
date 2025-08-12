import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Helper function to add base path to asset URLs
export function assetPath(path: string): string {
  // In production with GitHub Pages, add the base path
  const isProd = process.env.NODE_ENV === 'production'
  const basePath = isProd ? '/inorbit' : ''
  return `${basePath}${path}`
}