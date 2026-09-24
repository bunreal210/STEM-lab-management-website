/** @type {import('next').NextConfig} */
const nextConfig = {
  // Use SWC compiler (default in Next.js 13+) – faster than Babel
  compiler: {
    // Remove console.log in production
    removeConsole: process.env.NODE_ENV === 'production' ? { exclude: ['error', 'warn'] } : false,
  },

  // Restrict to known image origins instead of wildcard '**'
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: '*.supabase.co' },
      { protocol: 'https', hostname: 'lh3.googleusercontent.com' },     // Google OAuth avatars
      { protocol: 'https', hostname: 'avatars.githubusercontent.com' },  // GitHub OAuth avatars
      { protocol: 'https', hostname: 'graph.facebook.com' },             // Facebook OAuth avatars
    ],
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 86400, // Cache remote images for 1 day
  },

  // Experimental performance features
  experimental: {
    optimizePackageImports: ['lucide-react', '@supabase/supabase-js'],
  },

  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-DNS-Prefetch-Control', value: 'on' },
          { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=(), browsing-topics=()' },
          { key: 'X-XSS-Protection', value: '1; mode=block' },
        ],
      },
      {
        // Cache static assets aggressively
        source: '/assets/(.*)',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
        ],
      },
    ]
  },
}

export default nextConfig
