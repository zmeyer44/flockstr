import { z } from "zod";

type User = {
  npub: string;
  name?: string | undefined;
  username?: string | undefined;
  display_name?: string | undefined;
  picture?: string | undefined;
  banner?: string | undefined;
  about?: string | undefined;
  website?: string | undefined;
  lud06?: string | undefined;
  lud16?: string | undefined;
  nip05?: string | undefined;
};

const UserSchema = z.object({
  npub: z.string(),
  name: z.string().optional(),
  username: z.string().optional(),
  display_name: z.string().optional(),
  picture: z.string().optional(),
  banner: z.string().optional(),
  about: z.string().optional(),
  website: z.string().optional(),
  lud06: z.string().optional(),
  lud16: z.string().optional(),
  nip05: z.string().optional(),
});
const EventSchema = z.object({
  id: z.string(),
  content: z.string(),
  pubkey: z.string(),
  tags: z.string().array().array(),
  kind: z.number(),
  created_at: z.number(),
  sig: z.string(),
});

export { UserSchema, EventSchema };

export type { User };
