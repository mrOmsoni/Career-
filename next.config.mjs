/** @type {import('next').NextConfig} */
const nextConfig = {
  images:{
    remotePatterns:[
      {
        protocol:"https",
        hostname:"randomuser.me",
      },
    ],
  },
  experimental: {
    turbo: true, // ✅ explicitly enable Turbopack
    serverComponentsExternalPackages: ['@vercel/turbopack-next'], // helps with internal font resolution
  },
  compiler: {
    // Optional: enable styled-components or other compiler tweaks if needed
  },
  reactStrictMode: true,
  swcMinify: true,
};

export default nextConfig;