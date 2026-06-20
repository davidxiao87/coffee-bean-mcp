import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  // Supabase / 第三方图片域需在 next/image 白名单中
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "**.supabase.co" },
      { protocol: "https", hostname: "images.unsplash.com" },
    ],
  },
  // 允许中国地区浏览器在跨源请求中携带 Supabase cookie
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
        ],
      },
    ];
  },
};

export default nextConfig;
