import * as z from "zod";

export const userAuthSchema = z.object({
  email: z.string().email(),
  name: z.string().optional(),
  password: z.string(),
});
