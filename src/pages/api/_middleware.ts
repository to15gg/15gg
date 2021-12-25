import { NextRequest } from "next/server";
import { IS_PRODUCTION, IS_USING_RATE_LIMIT } from "utils";
import ipRateLimit from "utils/ip-rate-limit";

export async function middleware(req: NextRequest) {
  if (IS_PRODUCTION && IS_USING_RATE_LIMIT) {
    return await ipRateLimit(req);
  }
}
