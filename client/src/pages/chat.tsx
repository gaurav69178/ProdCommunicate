import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { type Message, type ChatRequest, type ChatResponse } from "@shared/schema";
import { ChatHeader } from "@/components/chat-header";
import { MessageList } from "@/components/message-list";
import { ChatInput } from "@/components/chat-input";
import { EmptyState } from "@/components/empty-state";
import { ErrorMessage } from "@/components/error-message";
import { Sidebar } from "@/components/ui/sidebar";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

const defaultPrompt = "A friendly AI chatbot";

type ApiResponse = ChatResponse & { isError?: boolean };
type ChatMutationVariables = { chatRequest: ChatRequest; userMessage: Message };

export default function Chat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [systemPrompt, setSystemPrompt] = useState(defaultPrompt);
  const [name, setName] = useState("Eon");
  const [age, setAge] = useState("27");
  const [isSidebarOpen, setSidebarOpen] = useState(false);
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
        history: currentMessages,
        systemPrompt: systemPrompt,
        name: name,
        age: age,
      };
      chatMutation.mutate({ chatRequest, userMessage });
      return [...currentMessages, userMessage];
    });
  };

  const handleSystemPromptClick = (prompt: string, name: string, age: string) => {
    setSystemPrompt(prompt);
    setName(name);
    setAge(age);
  };

  const handleRetry = () => {
    if (!failedMessage) return;

    const messageToRetry = failedMessage;
    setError(null);
    setFailedMessage(null);

    setMessages(currentMessages => {
      const chatRequest: ChatRequest = {
        message: messageToRetry.content,
        history: currentMessages,
        systemPrompt: systemPrompt,
        name: name,
        age: age,
      };
      chatMutation.mutate({ chatRequest, userMessage: messageToRetry });
      return [...currentMessages, messageToRetry];
    });
  };

  return (
    <div className="flex h-screen">
      <div className="hidden md:flex md:flex-col md:w-1/3 border-r">
        <div className="p-4 border-b">
          <h2 className="text-lg font-semibold">System Prompt</h2>
        </div>
        <div className="p-4 flex-grow space-y-4">
          <Textarea
            placeholder={defaultPrompt}
            value={systemPrompt}
            onChange={(e) => setSystemPrompt(e.target.value)}
            className="h-1/2 resize-none"
          />
          <div className="space-y-2">
            <Label>Bot's Name (Optional)</Label>
            <Input 
              placeholder="e.g. Alex" 
              value={name} 
              onChange={(e) => setName(e.target.value)} 
            />
          </div>
          <div className="space-y-2">
            <Label>Bot's Age (Optional)</Label>
            <Input 
              placeholder="e.g. 25" 
              value={age} 
              onChange={(e) => setAge(e.target.value)} 
            />
          </div>
        </div>
      </div>

      <div className="flex flex-col flex-1">
        <ChatHeader toggleSidebar={() => setSidebarOpen(!isSidebarOpen)} />
        <div className="flex-grow overflow-y-auto p-4">
          {messages.length === 0 && !chatMutation.isPending && !error ? (
            <EmptyState onSystemPromptClick={handleSystemPromptClick} />
          ) : (
            <MessageList messages={messages} isLoading={chatMutation.isPending} />
          )}
          {error && <ErrorMessage message={error} onRetry={failedMessage ? handleRetry : undefined} />}
        </div>
        <div className="flex-shrink-0 p-4 border-t">
          <ChatInput onSend={handleSendMessage} disabled={chatMutation.isPending} />
        </div>
      </div>

      <Sidebar
        isOpen={isSidebarOpen}
        onClose={() => setSidebarOpen(false)}
        systemPrompt={systemPrompt}
        setSystemPrompt={setSystemPrompt}
        defaultPrompt={defaultPrompt}
        name={name}
        setName={setName}
        age={age}
        setAge={setAge}
      />
    </div>
  );
}
