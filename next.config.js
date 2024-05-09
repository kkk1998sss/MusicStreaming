/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["dzprrrwpybqxebloajfs.supabase.co"],
  },
  output: "export", // <=== enables static exports
  reactStrictMode: true,
};

module.exports = nextConfig;
