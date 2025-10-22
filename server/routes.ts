import type { Express } from "express";
import { createServer, type Server } from "http";
import OpenAI from "openai";
import { z } from "zod";
import { chatRequestSchema, type ChatResponse } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Verify API key is configured
  if (!process.env.OPENROUTER_API_KEY) {
    console.error("WARNING: OPENROUTER_API_KEY environment variable is not set!");
  } else {
    console.log("OpenRouter API key is configured");
  }

  // Initialize OpenAI client with OpenRouter configuration
  const openai = new OpenAI({
    baseURL: "https://openrouter.ai/api/v1",
    apiKey: process.env.OPENROUTER_API_KEY,
    defaultHeaders: {
      "HTTP-Referer": process.env.REPLIT_DOMAINS 
        ? `https://${process.env.REPLIT_DOMAINS.split(',')[0]}`
        : "http://localhost:5000",
      "X-Title": "AI Chat - Replit",
    },
  });

  const MODEL = "cognitivecomputations/dolphin-mistral-24b-venice-edition:free";

  // POST /api/chat - Send message and get AI response
  app.post("/api/chat", async (req, res) => {
    try {
      const validatedData = chatRequestSchema.parse(req.body);
      const { message, history } = validatedData;

      console.log(`Processing chat request. History length: ${history.length}, Message: "${message.substring(0, 50)}..."`);

      // Add system prompt if this is the first message
      const messages = history.length === 0 
        ? [
            { role: "system" as const, content: "You are a helpful AI assistant. Be conversational, friendly, and concise in your responses." },
            ...history,
            { role: "user" as const, content: message }
          ]
        : [...history, { role: "user" as const, content: message }];

      console.log(`Sending request to OpenRouter with ${messages.length} messages`);

      // Call OpenRouter API
      const completion = await openai.chat.completions.create({
        model: MODEL,
        messages: messages.map(msg => ({
          role: msg.role,
          content: msg.content
        })),
      });

      const assistantMessage = completion.choices[0]?.message?.content;

      if (!assistantMessage) {
        console.error("OpenRouter returned empty response");
        throw new Error("No response from AI");
      }

      console.log(`Received response from OpenRouter: "${assistantMessage.substring(0, 50)}..."`);

      const response: ChatResponse = {
        message: assistantMessage,
        timestamp: Date.now(),
      };

      res.json(response);
    } catch (error) {
      console.error("Chat API error:", error);
      
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          error: "Invalid request data",
          details: error.errors 
        });
      }

      if (error instanceof Error) {
        // Check for OpenRouter-specific errors
        if (error.message.includes("API key") || error.message.includes("401")) {
          console.error("Authentication error - check API key configuration");
          return res.status(401).json({ 
            error: "Authentication failed. Please check API key configuration." 
          });
        }
        
        return res.status(500).json({ 
          error: "Failed to generate response",
          message: error.message 
        });
      }

      res.status(500).json({ error: "An unexpected error occurred" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
