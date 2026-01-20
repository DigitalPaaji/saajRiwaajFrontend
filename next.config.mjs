/** @type {import('next').NextConfig} */
const nextConfig = {
 images: {
  remotePatterns: [
    {
      protocol: "http",
      hostname: "api.saajriwaaj.com",
      pathname: "/uploads/**",
    },
  ],
},

};

export default nextConfig;
