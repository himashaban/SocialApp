/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "linked-posts.routemisr.com",
        pathname: "/uploads/*",
      },
    ],
  },
  eslint: {
    ignoreDuringBuilds: true, // Ignores ESLint errors during the build process
  },
  output: "export", 
  distDir: "dist", // Ensures Next.js is in static export mode
  // assetPrefix: "/SocialApp/", // Uses the repository name here to handle paths
};

export default nextConfig;
