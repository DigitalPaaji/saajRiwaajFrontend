/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "https://api.saajriwaaj.com",
        pathname: "/uploads/**",
      },
    ],
  },
};

export default nextConfig;
