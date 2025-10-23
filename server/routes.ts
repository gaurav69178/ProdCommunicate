import type { Express } from "express";
import { createServer, type Server } from "http";
import OpenAI from "openai";
import { z } from "zod";
import { chatRequestSchema, type ChatResponse } from "@shared/schema";

// Extend the ChatResponse type to include an optional error flag
type ApiResponse = ChatResponse & { isError?: boolean };

export async function registerRoutes(app: Express): Promise<Server> {
  if (!process.env.OPENROUTER_API_KEY) {
    console.error("WARNING: OPENROUTER_API_KEY environment variable is not set!");
  }

  const openai = new OpenAI({
    baseURL: "https://openrouter.ai/api/v1",
    apiKey: process.env.OPENROUTER_API_KEY,
    defaultHeaders: {
      "HTTP-Referer": process.env.REPLIT_DOMAINS
        ? `https://${process.env.REPLIT_DOMAINS.split(",")[0]}`
        : "http://localhost:5000",
      "X-Title": "AI Chat - Replit",
    },
  });

  const MODEL = "cognitivecomputations/dolphin-mistral-24b-venice-edition:free";

  app.post("/api/chat", async (req, res) => {
    try {
      const validatedData = chatRequestSchema.parse(req.body);
      const { message, history, systemPrompt, name, age } = validatedData;

      let finalSystemPrompt = systemPrompt || "A friendly AI chatbot";
      if (name && age) {
        finalSystemPrompt += `\n\nYou are a chatbot named ${name} and you are ${age} years old.`;
      } else if (name) {
        finalSystemPrompt += `\n\nYou are a chatbot named ${name}.`;
      } else if (age) {
        finalSystemPrompt += `\n\nYou are a chatbot who is ${age} years old.`;
      }

      const messages = [
        { role: "system" as const, content: finalSystemPrompt },
        ...history,
        { role: "user" as const, content: message },
      ];

      const completion = await openai.chat.completions.create({
        model: MODEL,
        messages: messages.map((msg) => ({ role: msg.role, content: msg.content })),
      });

      const assistantMessage = completion.choices[0]?.message?.content;
      if (!assistantMessage) {
        throw new Error("No response from AI");
      }

      const response: ApiResponse = {
        message: assistantMessage,
        timestamp: Date.now(),
        isError: false,
      };

      res.json(response);

    } catch (error: any) {
      console.error("Chat API error:", error);

      res.status(500).json({
        error: error.message || "An unexpected error occurred."
      });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
