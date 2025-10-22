import { MessageSquare, Sparkles, Lightbulb, Code } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EmptyStateProps {
  onPromptClick: (prompt: string) => void;
}

const suggestedPrompts = [
  {
    icon: Sparkles,
    text: "Tell me a creative story",
    prompt: "Tell me a creative and engaging short story.",
  },
  {
    icon: Lightbulb,
    text: "Explain a complex topic",
    prompt: "Explain quantum computing in simple terms.",
  },
  {
    icon: Code,
    text: "Help me code",
    prompt: "Help me write a function to reverse a string in JavaScript.",
  },
];

export function EmptyState({ onPromptClick }: EmptyStateProps) {
  return (
    <div className="flex flex-1 items-center justify-center px-4">
      <div className="flex max-w-2xl flex-col items-center gap-8 text-center">
        <div className="flex flex-col items-center gap-3">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10">
            <MessageSquare className="h-8 w-8 text-primary" data-testid="icon-empty-state" />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-semibold" data-testid="text-welcome-title">
              Start a Conversation
            </h2>
            <p className="text-muted-foreground" data-testid="text-welcome-description">
              Ask me anything! I'm here to help with your questions, ideas, and tasks.
            </p>
          </div>
        </div>

        <div className="w-full space-y-3">
          <p className="text-sm font-medium text-muted-foreground">Suggested prompts:</p>
          <div className="grid gap-2 md:grid-cols-3">
            {suggestedPrompts.map((prompt, index) => {
              const Icon = prompt.icon;
              return (
                <Button
                  key={index}
                  variant="outline"
                  className="h-auto flex-col gap-2 rounded-xl p-4 text-left hover-elevate active-elevate-2"
                  onClick={() => onPromptClick(prompt.prompt)}
                  data-testid={`button-prompt-${index}`}
                >
                  <Icon className="h-5 w-5 text-primary" />
                  <span className="text-sm font-medium">{prompt.text}</span>
                </Button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
