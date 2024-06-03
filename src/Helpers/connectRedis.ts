import { createClient, RedisClientType, RedisClientOptions } from "redis";

export const connectRedis = (): RedisClientType => {
  try {
    const client: any = createClient({
      url: `redis://${process.env.REDIS_HOST || "localhost"}:${process.env.REDIS_PORT ? parseInt(process.env.REDIS_PORT) : 6379}`,
    } as RedisClientOptions);

    client.on("connect", () => {
      console.log("Connected to Redis");
    });

    client.on("end", () => {
      console.log("Disconnected from Redis");
    });

    process.on("SIGINT", async () => {
      await client.quit();
      process.exit(0);
    });

    client.connect().catch(console.error);

    return client;
  } catch (error) {
    console.error("Error connecting to Redis");
    console.error(error);
    throw error; // Rethrow the error to ensure the caller knows something went wrong
  }
};
