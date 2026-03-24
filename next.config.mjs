/** @type {import('next').NextConfig} */
const nextConfig = {
  reactCompiler: true,
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: process.env.API_URL
          ? `${process.env.API_URL}/api/:path*`
          : "http://localhost:5000/api/:path*",
      },
    ];
  },
};

export default nextConfig;
