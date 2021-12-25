import { NextRequest, NextResponse } from "next/server";
import upstash from "./upstash";

type Increment = (data: { key: string; timeframe: number }) => Promise<number>;

function getIP(request: Request) {
  const xff = request.headers.get("x-forwarded-for");
  return xff ? xff.split(",")[0] : "127.0.0.1";
}

const increment: Increment = async ({ key, timeframe }) => {
  const [incrResult] = await Promise.all([
    upstash.incr(key),
    upstash.expire(key, timeframe),
  ]);

  return incrResult.data as number;
};

const rateLimited = (id: string) =>
  new Response(
    JSON.stringify({
      error: { message: `API rate limit exceeded for ${id}` },
    }),
    { status: 403, headers: { "Content-Type": "application/json" } }
  );

export default async function ipRateLimit(request: NextRequest) {
  const id = `ip:${getIP(request)}`;
  const limit = Number(process.env.RATE_LIMIT_MAX);
  const timeframe = Number(process.env.RATE_LIMIT_TIMEFRAME);

  const start = Date.now();
  const time = Math.floor(Date.now() / 1000 / timeframe);
  const key = `${id}:${time}`;

  const response = NextResponse.next();

  try {
    const count = await increment({ key, timeframe });
    const remaining = limit - count;

    if (remaining < 0) {
      return rateLimited(id);
    }

    const reset = (time + 1) * timeframe;
    const latency = Date.now() - start;

    const { headers } = response;

    headers.set(`X-RateLimit-Limit`, `${limit}`);
    headers.set(`X-RateLimit-Remaining`, `${remaining < 0 ? 0 : remaining}`);
    headers.set(`X-RateLimit-Reset`, `${reset}`);
    headers.set("x-upstash-latency", `${latency}`);

    return response;
  } catch (error) {
    return response;
  }
}
