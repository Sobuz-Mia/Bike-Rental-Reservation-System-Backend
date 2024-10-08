import { z } from "zod";

const createUserValidationSchema = z.object({
  body: z.object({
    name: z.string(),
    email: z.string(),
    password: z.string(),
    phone: z.string(),
    address: z.string(),
    role: z.enum(["admin", "user"]),
  }),
});

const updateValidationSchema = z.object({
  body: z.object({
    name: z.string().optional(),
    email: z.string().optional(),
    password: z.string().optional(),
    phone: z.string().optional(),
    address: z.string().optional(),
    role: z.enum(["admin", "user"]).optional(),
  }),
});

export const userValidations = {
  createUserValidationSchema,
  updateValidationSchema,
};
