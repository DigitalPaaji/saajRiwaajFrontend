/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "api.saajriwaaj.com",
        pathname: "/uploads/**",
      },
       {
        protocol: "https",
        hostname: "saajriwaaj.com",
        pathname: "/_next/image**",
      },
      {
        protocol: "http",
        hostname: "localhost",
        port: "5000", // change to your backend port
        pathname: "/uploads/**",
      },
    ],
  },
};

export default nextConfig;
