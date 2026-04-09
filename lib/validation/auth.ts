import { z } from "zod";

export const signInSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8).max(128),
});

export const signUpSchema = z.object({
  name: z.string().min(2).max(80),
  email: z.string().email(),
  password: z.string().min(8).max(128),
  businessName: z.string().min(2).max(120),
  businessCategory: z.string().min(2).max(80),
  timezone: z.string().min(2).max(64),
});

export type SignInInput = z.infer<typeof signInSchema>;
export type SignUpInput = z.infer<typeof signUpSchema>;
