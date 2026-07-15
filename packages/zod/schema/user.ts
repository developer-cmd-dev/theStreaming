import { z } from "zod";

export const roleSchema = z.enum(["USER", "ADMIN"]);

/** Full DB shape — useful for typing/serialization, not raw signup input */
export const userSchema = z.object({
  id: z.uuid(),
  email: z.email(),
  password: z.string().min(8),
  username: z
    .string()
    .min(3)
    .max(15)
    .regex(/^[a-zA-Z0-9_]+$/, "Username can only contain letters, numbers, and underscores"),
  role: roleSchema,
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
});

/** Signup / create — only what the client sends */
export const createUserSchema = userSchema.pick({
  email: true,
  password: true,
  username: true,
});

export const loginUserScheam = userSchema.pick({
  username:true,
  password:true
});

export const logOutUserSchema = userSchema.pick({
  id:true
})

/** Safe user for API responses */
export const publicUserSchema = userSchema.omit({
  password: true,
  role:true
});

/** Partial updates */
export const updateUserSchema = createUserSchema.partial();

export type Role = z.infer<typeof roleSchema>;
export type User = z.infer<typeof userSchema>;
export type CreateUserInput = z.infer<typeof createUserSchema>;
export type PublicUser = z.infer<typeof publicUserSchema>;
export type UpdateUserInput = z.infer<typeof updateUserSchema>;
export type LoginUserInput = z.infer<typeof loginUserScheam>;
export type LogoutUserInput = z.infer<typeof logOutUserSchema>