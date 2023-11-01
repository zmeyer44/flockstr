import { Redis } from "@upstash/redis";

const redis = new Redis({
  url: "https://us1-new-mako-37785.upstash.io",
  token: process.env.UPSTASH_REDIS_REST_TOKEN as string,
});

export { redis };
