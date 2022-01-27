import { NextRequest, NextResponse } from "next/server";

import { IS_PRODUCTION, IS_USING_RATE_LIMIT } from "utils";
import ipRateLimit from "utils/ip-rate-limit";

export const middleware = async (req: NextRequest) => {
  return IS_PRODUCTION && IS_USING_RATE_LIMIT
    ? await ipRateLimit(req)
    : NextResponse.next();
};
