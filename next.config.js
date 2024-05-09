/** @type {import('next').NextConfig} */
const nextConfig = {
    output: "export", // <=== enables static exports
  images: {
    domains: ["dzprrrwpybqxebloajfs.supabase.co"],
  },
//   reactStrictMode: true,
};

module.exports = nextConfig;
