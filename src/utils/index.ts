export const IS_SSR = typeof window === "undefined";
export const IS_PRODUCTION = process.env.NODE_ENV === "production";
export const IS_DEVELOPMENT = process.env.NODE_ENV === "development";
export const IS_TEST = process.env.NODE_ENV === "test";
export const IS_USING_RATE_LIMIT =
  process.env.RATE_LIMIT_MAX !== undefined &&
  process.env.RATE_LIMIT_TIMEFRAME !== undefined;
