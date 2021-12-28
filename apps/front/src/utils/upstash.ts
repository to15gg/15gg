import * as upstash from "@upstash/redis";

upstash.auth(
  process.env.UPSTASH_REDIS_REST_URL,
  process.env.UPSTASH_REDIS_REST_TOKEN
);

export default upstash;
