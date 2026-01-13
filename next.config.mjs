/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
          {
        protocol: "http",
        hostname: "localhost",
        port: "5000",
        pathname: "/uploads/**",
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
      {
        protocol: "https",
        hostname: "dummyimage.com",
      },
      {
        protocol: "https",
        hostname: "example.com",   // ⭐ ADD THIS
      },
    ],
  },
};

export default nextConfig;
