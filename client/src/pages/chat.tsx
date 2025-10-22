import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { type Message, type ChatRequest, type ChatResponse } from "@shared/schema";
import { ChatHeader } from "@/components/chat-header";
import { MessageList } from "@/components/message-list";
import { ChatInput } from "@/components/chat-input";
import { EmptyState } from "@/components/empty-state";
import { ErrorMessage } from "@/components/error-message";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export default function Chat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const chatMutation = useMutation({
    mutationFn: async (data: ChatRequest) => {
      const response = await apiRequest<ChatResponse>("POST", "/api/chat", data);
      return response;
    },
    onSuccess: (data) => {
      const assistantMessage: Message = {
        role: "assistant",
        content: data.message,
        timestamp: data.timestamp,
      };
      setMessages((prev) => [...prev, assistantMessage]);
      setError(null);
    },
    onError: (err: Error) => {
      setError(err.message || "Failed to get response. Please try again.");
      toast({
        title: "Error",
        description: err.message || "Failed to get response from the AI",
        variant: "destructive",
      });
    },
  });

  const handleSendMessage = async (content: string) => {
    const userMessage: Message = {
      role: "user",
      content,
      timestamp: Date.now(),
    };

    // Update messages with the new user message and capture the updated state
    setMessages((prevMessages) => {
      const updatedMessages = [...prevMessages, userMessage];
      
      // Send the chat request with the complete history (excluding the current user message)
      const chatRequest: ChatRequest = {
        message: content,
        history: prevMessages, // This now correctly includes all previous messages including assistant responses
      };

      setError(null);
      chatMutation.mutate(chatRequest);
      
      return updatedMessages;
    });
  };

  const handleRetry = () => {
    if (messages.length > 0) {
      const lastUserMessage = [...messages].reverse().find(m => m.role === "user");
      if (lastUserMessage) {
        const chatRequest: ChatRequest = {
          message: lastUserMessage.content,
          history: messages.filter(m => m !== lastUserMessage),
        };
        setError(null);
        chatMutation.mutate(chatRequest);
      }
    }
  };

  return (
    <div className="flex h-[100dvh] flex-col">
      <ChatHeader />
      {messages.length === 0 && !chatMutation.isPending ? (
        <EmptyState onPromptClick={handleSendMessage} />
      ) : (
        <>
          <MessageList messages={messages} isLoading={chatMutation.isPending} />
          {error && <ErrorMessage message={error} onRetry={handleRetry} />}
        </>
      )}
      <ChatInput onSend={handleSendMessage} disabled={chatMutation.isPending} />
    </div>
  );
}
