import { z } from "zod";

// Chat message schema
export const messageSchema = z.object({
  role: z.enum(["user", "assistant", "system"]),
  content: z.string(),
  timestamp: z.number().optional(),
});

export type Message = z.infer<typeof messageSchema>;

// Chat request schema (for API)
export const chatRequestSchema = z.object({
  message: z.string().min(1, "Message cannot be empty"),
  history: z.array(messageSchema),
});

export type ChatRequest = z.infer<typeof chatRequestSchema>;

// Chat response schema
export const chatResponseSchema = z.object({
  message: z.string(),
  timestamp: z.number(),
});

export type ChatResponse = z.infer<typeof chatResponseSchema>;
