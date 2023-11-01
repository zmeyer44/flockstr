"use server";
import { redis } from "@/lib/clients/redis";
import { z } from "zod";

const eventSchema = z.object({
  identifier: z.string(),
  name: z.string(),
  description: z.string(),
  image: z.string(),
});

export async function get(identifier: string) {
  const data = await redis.get(identifier);
  console.log("Data", data);
  try {
    const parsedData = eventSchema.parse({ identifier, ...(data as Object) });
    return parsedData;
  } catch (err) {
    console.log("Error", err);
    return;
  }
}
export async function add(data: z.infer<typeof eventSchema>) {
  let { identifier, name, description, image } = data;
  try {
    redis.set(identifier, { name, description, image });
    return {
      success: true,
    };
  } catch (err) {
    console.log("Error", err);
    return;
  }
}
