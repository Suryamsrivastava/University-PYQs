/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
    ],
  },
  // Increase API route body size limit for file uploads
  api: {
    bodyParser: {
      sizeLimit: "50mb",
    },
  },
  experimental: {
    // Disable body size limit for API routes
    isrMemoryCacheSize: 0,
  },
};

module.exports = nextConfig;
