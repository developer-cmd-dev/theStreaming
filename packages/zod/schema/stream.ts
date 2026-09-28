import { z } from "zod";

// Exportable base Stream schema following prisma model fields
export const streamSchema = z.object({
  id: z.string().uuid(),
  title: z.string(),
  description: z.string().optional(),
  active :z.boolean().default(true),
  isLive: z.boolean().default(false),
  thumbnail: z.file().optional(),
  subscriberOnly:z.boolean().default(false),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
  userId: z.string().uuid(),
  chat: z.any().optional(), // Reference to Chat, further Zod validation can be added if Chat schema exists
});

// For creating a Stream (id, timestamps, etc. auto-generated)
export const createStreamSchema = streamSchema.pick({
  title:true,
  description:true,
  thumbnail:true,
  active:true,
  subscriberOnly:true,
  isLive:true,
})


export const connectMediaServerSchema = z.object({
  sdp:z.string(),
  type:z.string(),
  streamId:z.string()
})

// For updating a Stream (usually partial except userId and id)
export const updateStreamSchema = streamSchema.partial().extend({
  id: z.string().uuid(),
});

// Types
export type CreatedStreamState ={
  id:string
  title:string,
  description?: string;
  thumbnail?: string; // 'thumbnail' field as File since streamSchema uses z.file()
  subscriberOnly: boolean;
  active:boolean;
  isLive: boolean;
}
export type Stream = z.infer<typeof streamSchema>;
export type CreateStreamInput = z.infer<typeof createStreamSchema>;
export type UpdateStreamInput = z.infer<typeof updateStreamSchema>;
export type connectMediaServerInput = z.infer<typeof connectMediaServerSchema>