import * as z from "zod";

export const userInfoSchema = z.object({
  email: z.string().email(),
  name: z.string().min(3),
  password: z.string().min(8),
});
