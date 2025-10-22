import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  systemPrompt: string;
  setSystemPrompt: (value: string) => void;
  defaultPrompt: string;
  name: string;
  setName: (value: string) => void;
  age: string;
  setAge: (value: string) => void;
}

export function Sidebar({ 
  isOpen, 
  onClose, 
  systemPrompt, 
  setSystemPrompt, 
  defaultPrompt, 
  name, 
  setName, 
  age, 
  setAge 
}: SidebarProps) {
  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="w-full max-w-sm">
        <SheetHeader>
          <SheetTitle>System Prompt</SheetTitle>
          <SheetDescription>
            Set the behavior and personality of the AI. You can also provide your name and age for a more personalized experience.
          </SheetDescription>
        </SheetHeader>
        <div className="py-4 space-y-4">
          <Textarea
            placeholder={defaultPrompt}
            value={systemPrompt}
            onChange={(e) => setSystemPrompt(e.target.value)}
            className="min-h-[200px] resize-none"
          />
          <div className="space-y-2">
            <Label>Your Name (Optional)</Label>
            <Input 
              placeholder="e.g. Alex" 
              value={name} 
              onChange={(e) => setName(e.target.value)} 
            />
          </div>
          <div className="space-y-2">
            <Label>Your Age (Optional)</Label>
            <Input 
              placeholder="e.g. 25" 
              value={age} 
              onChange={(e) => setAge(e.target.value)} 
            />
          </div>
        </div>
        <Button onClick={onClose}>Done</Button>
      </SheetContent>
    </Sheet>
  );
}
