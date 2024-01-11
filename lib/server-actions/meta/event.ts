"use server";
import prisma from "@/db/client";

export async function getEvent(kind: number, pubkey: string, d: string) {
  return await prisma.nostrEvent.findFirst({
    where: {
      kind,
      pubkey,
      d,
    },
  });
}
