/ @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "backend.gamehub60.com",
        pathname: "",
      },
    ],
  },
};

export default nextConfig;
