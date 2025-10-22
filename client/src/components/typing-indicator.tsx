import { Bot } from "lucide-react";

export function TypingIndicator() {
  return (
    <div className="flex w-full animate-fade-in gap-3 px-4 py-3" data-testid="typing-indicator">
      <div className="flex-shrink-0">
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-accent">
          <Bot className="h-4 w-4 text-accent-foreground" />
        </div>
      </div>
      <div className="flex max-w-[85%] flex-col gap-1 md:max-w-[75%]">
        <span className="text-xs text-muted-foreground">Assistant</span>
        <div className="rounded-2xl bg-message-assistant px-4 py-3">
          <div className="flex gap-1">
            <div className="h-2 w-2 animate-pulse-subtle rounded-full bg-message-assistant-foreground/40" />
            <div className="h-2 w-2 animate-pulse-subtle rounded-full bg-message-assistant-foreground/40 [animation-delay:0.2s]" />
            <div className="h-2 w-2 animate-pulse-subtle rounded-full bg-message-assistant-foreground/40 [animation-delay:0.4s]" />
          </div>
        </div>
      </div>
    </div>
  );
}
