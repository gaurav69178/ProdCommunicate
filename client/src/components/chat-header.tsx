import { Moon, Sun, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "./theme-provider";

export function ChatHeader() {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="sticky top-0 z-10 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/95">
      <div className="flex h-14 items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <MessageSquare className="h-5 w-5 text-primary" data-testid="icon-logo" />
          <h1 className="text-lg font-semibold" data-testid="text-app-title">
            AI Chat
          </h1>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleTheme}
          data-testid="button-theme-toggle"
          aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
        >
          {theme === "light" ? (
            <Moon className="h-5 w-5" />
          ) : (
            <Sun className="h-5 w-5" />
          )}
        </Button>
      </div>
    </header>
  );
}
