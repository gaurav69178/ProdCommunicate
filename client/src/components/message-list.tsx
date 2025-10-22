import { useEffect, useRef } from "react";
import { type Message } from "@shared/schema";
import { MessageBubble } from "./message-bubble";
import { TypingIndicator } from "./typing-indicator";

interface MessageListProps {
  messages: Message[];
  isLoading?: boolean;
}

export function MessageList({ messages, isLoading = false }: MessageListProps) {
  const bottomRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isLoading]);

  const shouldGroupMessage = (current: Message, previous: Message | undefined): boolean => {
    if (!previous) return false;
    if (current.role !== previous.role) return false;
    if (!current.timestamp || !previous.timestamp) return false;
    const timeDiff = current.timestamp - previous.timestamp;
    return timeDiff < 60000;
  };

  return (
    <div
      ref={containerRef}
      className="flex-1 overflow-y-auto scroll-smooth"
      data-testid="message-list"
    >
      <div className="mx-auto max-w-3xl space-y-0">
        {messages.map((message, index) => (
          <MessageBubble
            key={`${message.role}-${message.timestamp || index}`}
            message={message}
            isGrouped={shouldGroupMessage(message, messages[index - 1])}
          />
        ))}
        {isLoading && <TypingIndicator />}
        <div ref={bottomRef} />
      </div>
    </div>
  );
}
