import * as z from "zod";

export const updatedUserSchema = z.object({
  name: z.string().min(1).nullish(),
  image: z.string().min(1).nullish(),
});
