/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: true,
    swcPlugins: ["next-superjson-plugin"],
  },
  async rewrites() {
    return [
      {
        source: "/.well-known/nostr.json",
        destination: "/api/well-known/nostr",
      },
    ];
  },
  images: {
    domains: [
      "t2.gstatic.com",
      "www.google.com",
      "whop.com",
      "flockstr.s3.amazonaws.com",
    ],
  },
};

module.exports = nextConfig;
