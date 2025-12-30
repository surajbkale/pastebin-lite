import Redis from "ioredis";

const getRedisUrl = () => {
  if (process.env.REDIS_URL) {
    return process.env.REDIS_URL;
  }
  return "redis://localhost:6379";
};

const globalForRedis = global as unknown as { redis: Redis };

export const redis = globalForRedis.redis || new Redis(getRedisUrl());

if (process.env.NODE_ENV !== "production") globalForRedis.redis = redis;
