import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/",
        destination: "/muse",
        permanent: false,
        missing: [{ type: "query", key: "studio" }],
      },
    ];
  },
};

export default nextConfig;
