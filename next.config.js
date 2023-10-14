/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: "/.well-known/nostr.json",
        destination: "/api/well-known",
      },
    ];
  },
  images: {
    domains: ["t2.gstatic.com", "www.google.com", "whop.com"],
  },
};

module.exports = nextConfig;
