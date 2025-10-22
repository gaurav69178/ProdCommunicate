import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";

interface ChatHeaderProps {
  toggleSidebar: () => void;
}

export function ChatHeader({ toggleSidebar }: ChatHeaderProps) {
  return (
    <header className="flex h-16 items-center justify-between border-b bg-background px-4">
      <div className="flex items-center gap-2">
        <img src="/favicon.png" alt="Logo" className="h-8 w-8" />
        <h1 className="text-lg font-semibold">AI Chatbot</h1>
      </div>
      <Button variant="ghost" size="icon" className="md:hidden" onClick={toggleSidebar}>
        <Menu className="h-6 w-6" />
      </Button>
    </header>
  );
}
