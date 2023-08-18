const upstashRedisRestUrl = process.env.UPSTASH_REDIS_REST_URL;
const upstashRedisRestToken = process.env.UPSTASH_REDIS_REST_TOKEN;

type Command = "get" | "sismember" | "smembers" | "zrange";

export const fetchRedis = async (command: Command, ...args: string[]) => {
  const url = `${upstashRedisRestUrl}/${command}/${args.join("/")}`;

  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${upstashRedisRestToken}` },
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error(`Error executing redis command ${res.statusText}`);
  }

  const data = await res.json();
  return data.result;
};
