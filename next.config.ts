import type { NextConfig } from 'next'

const isProd = process.env.NODE_ENV === 'production'

const nextConfig: NextConfig = {
  output: 'export',
  basePath: '',
  assetPrefix: '',
  experimental: {
    optimizePackageImports: ['clsx', 'tailwind-merge']
  },
  images: {
    unoptimized: true,
    domains: [],
    formats: ['image/webp', 'image/avif'],
  },
  webpack: (config) => {
    // Handle font URLs in CSS
    config.module.rules.push({
      test: /\.(woff|woff2|eot|ttf|otf)$/,
      type: 'asset/resource',
    })
    return config
  },
}

export default nextConfig