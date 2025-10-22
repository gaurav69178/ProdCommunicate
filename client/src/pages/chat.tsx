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
import { Textarea } from "@/components/ui/textarea";

const defaultPrompt = "A friendly AI chatbot";

type ApiResponse = ChatResponse & { isError?: boolean };
type ChatMutationVariables = { chatRequest: ChatRequest; userMessage: Message };

export default function Chat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [systemPrompt, setSystemPrompt] = useState(defaultPrompt);
  const [error, setError] = useState<string | null>(null);
  const [failedMessage, setFailedMessage] = useState<Message | null>(null);
  const { toast } = useToast();

  const chatMutation = useMutation({
    mutationFn: async (variables: ChatMutationVariables) => {
      const response = await apiRequest("POST", "/api/chat", variables.chatRequest);
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || "API request failed unexpectedly");
      }
      return response.json() as Promise<ApiResponse>;
    },
    onSuccess: (data, variables) => {
      if (data.isError) {
        setError(data.message);
        setFailedMessage(variables.userMessage);
        setMessages((prev) => prev.filter(m => m.timestamp !== variables.userMessage.timestamp));
      } else {
        const assistantMessage: Message = {
          role: "assistant",
          content: data.message,
          timestamp: data.timestamp,
        };
        setMessages((prev) => [...prev, assistantMessage]);
        setError(null);
        setFailedMessage(null);
      }
    },
    onError: (err: Error, variables) => {
      setError(err.message);
      setFailedMessage(variables.userMessage);
      setMessages((prev) => prev.filter(m => m.timestamp !== variables.userMessage.timestamp));
      toast({ title: "Error", description: err.message, variant: "destructive" });
    },
  });

  const handleSendMessage = (content: string) => {
    const userMessage: Message = { role: "user", content, timestamp: Date.now() };

    setError(null);
    setFailedMessage(null);

    setMessages(currentMessages => {
      const chatRequest: ChatRequest = {
        message: content,
        history: currentMessages, // Use state from updater to guarantee it's current
        systemPrompt: systemPrompt,
      };
      chatMutation.mutate({ chatRequest, userMessage });
      return [...currentMessages, userMessage]; // Return new state with optimistic message
    });
  };

  const handleRetry = () => {
    if (!failedMessage) return;

    const messageToRetry = failedMessage;
    setError(null);
    setFailedMessage(null);

    setMessages(currentMessages => {
      const chatRequest: ChatRequest = {
        message: messageToRetry.content,
        history: currentMessages, // currentMessages is the correct history (without the failed message)
        systemPrompt: systemPrompt,
      };
      chatMutation.mutate({ chatRequest, userMessage: messageToRetry });
      return [...currentMessages, messageToRetry]; // Optimistically add the retried message back
    });
  };

  return (
    <div className="flex h-[100dvh] flex-col">
      <ChatHeader />
      <div className="flex-shrink-0 p-4 border-b">
        <Textarea
          placeholder={defaultPrompt}
          value={systemPrompt}
          onChange={(e) => setSystemPrompt(e.target.value)}
          className="resize-none"
        />
      </div>
      <div className="flex-grow overflow-y-auto p-4">
        {messages.length === 0 && !chatMutation.isPending && !error ? (
          <EmptyState onPromptClick={handleSendMessage} />
        ) : (
          <MessageList messages={messages} isLoading={chatMutation.isPending} />
        )}
        {error && <ErrorMessage message={error} onRetry={failedMessage ? handleRetry : undefined} />}
      </div>
      <div className="flex-shrink-0 p-4 border-t">
        <ChatInput onSend={handleSendMessage} disabled={chatMutation.isPending} />
      </div>
    </div>
  );
}
