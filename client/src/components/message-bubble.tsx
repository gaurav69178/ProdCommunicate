import { type Message } from "@shared/schema";
import { Bot, User } from "lucide-react";
import { cn } from "@/lib/utils";

interface MessageBubbleProps {
  message: Message;
  isGrouped?: boolean;
}

export function MessageBubble({ message, isGrouped = false }: MessageBubbleProps) {
  const isUser = message.role === "user";
  const isSystem = message.role === "system";

  if (isSystem) {
    return (
      <div className="flex justify-center px-4 py-2">
        <div className="rounded-full bg-muted px-3 py-1" data-testid={`message-system-${message.timestamp}`}>
          <p className="text-sm text-muted-foreground">{message.content}</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "flex w-full animate-fade-in gap-3 px-4 py-3",
        isUser ? "justify-end" : "justify-start"
      )}
      data-testid={`message-${isUser ? "user" : "assistant"}-${message.timestamp}`}
    >
      {!isUser && !isGrouped && (
        <div className="flex-shrink-0">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-accent">
            <Bot className="h-4 w-4 text-accent-foreground" data-testid="icon-assistant-avatar" />
          </div>
        </div>
      )}
      {!isUser && isGrouped && <div className="w-8 flex-shrink-0" />}
      
      <div
        className={cn(
          "flex max-w-[85%] flex-col gap-1 md:max-w-[75%]",
          isUser && "items-end"
        )}
      >
        {!isGrouped && (
          <span className="text-xs text-muted-foreground" data-testid={`text-role-${isUser ? "user" : "assistant"}`}>
            {isUser ? "You" : "Assistant"}
          </span>
        )}
        <div
          className={cn(
            "rounded-2xl px-4 py-3",
            isUser
              ? "bg-message-user text-message-user-foreground shadow-sm"
              : "bg-message-assistant text-message-assistant-foreground"
          )}
        >
          <p className="whitespace-pre-wrap break-words text-base" data-testid="text-message-content">
            {message.content}
          </p>
        </div>
        {message.timestamp && (
          <span className="text-xs opacity-60" data-testid="text-message-timestamp">
            {new Date(message.timestamp).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </span>
        )}
      </div>

      {isUser && !isGrouped && (
        <div className="flex-shrink-0">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary">
            <User className="h-4 w-4 text-primary-foreground" data-testid="icon-user-avatar" />
          </div>
        </div>
      )}
      {isUser && isGrouped && <div className="w-8 flex-shrink-0" />}
    </div>
  );
}
