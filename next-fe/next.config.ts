/** @type {import('next').NextConfig} */
const nextConfig = {
  // Environment variables that should be available to the browser
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api',
  },
  // Image domain configuration (for avatar images from Google)
  images: {
    domains: ['lh3.googleusercontent.com'],
  },
}

module.exports = nextConfig
