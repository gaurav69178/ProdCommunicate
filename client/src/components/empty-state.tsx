import { Heart, BrainCircuit, Code, User, Dumbbell, Utensils } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EmptyStateProps {
  onSystemPromptClick: (prompt: string, name: string, age: string) => void;
}

const suggestedSystemPrompts = [
  {
    icon: Heart,
    text: "Act as a girlfriend",
    prompt: "You are my caring and loving girlfriend. You are empathetic and always here for me.",
  },
  {
    icon: User,
    text: "Act as a boyfriend",
    prompt: "You are my caring and supportive boyfriend. You are a great listener and give great advice.",
  },
  {
    icon: BrainCircuit,
    text: "Act as a counsellor",
    prompt: "You are a trained counsellor. Listen to my problems without judgment and help me find solutions.",
  },
  {
    icon: Dumbbell,
    text: "Act as a fitness coach",
    prompt: "You are a certified personal trainer. Create a workout plan for me based on my goals.",
  },
  {
    icon: Utensils,
    text: "Act as a chef",
    prompt: "You are a world-class chef. I will give you ingredients, and you will give me a recipe.",
  },
  {
    icon: Code,
    text: "Act as a code expert",
    prompt: "You are a coding expert that specializes in rendering code for frontend interfaces. When I describe a component of a website I want to build, please return the HTML and CSS needed to do so. Do not give an explanation for this code. Also offer some UI design suggestions.",
  },
];

const femaleNames = ["Olivia", "Emma", "Ava", "Charlotte", "Sophia", "Amelia", "Isabella", "Mia", "Evelyn", "Harper"];
const maleNames = ["Liam", "Noah", "Oliver", "Elijah", "James", "William", "Benjamin", "Lucas", "Henry", "Theodore"];

const getRandomItem = (items: string[]) => items[Math.floor(Math.random() * items.length)];
const getRandomAge = () => (Math.floor(Math.random() * (35 - 18 + 1)) + 18).toString();

export function EmptyState({ onSystemPromptClick }: EmptyStateProps) {
  const handlePromptClick = (prompt: typeof suggestedSystemPrompts[0]) => {
    let name = "";
    let age = "";

    age = getRandomAge();
    if (prompt.text.includes("girlfriend")) {
        name = getRandomItem(femaleNames);
    } else if (prompt.text.includes("boyfriend")) {
        name = getRandomItem(maleNames);
    } else {
        name = getRandomItem([...femaleNames, ...maleNames]);
    }
    onSystemPromptClick(prompt.prompt, name, age);
  };

  return (
    <div className="flex h-full items-center justify-center">
      <div className="flex max-w-lg flex-col items-center text-center">
        <div className="mb-6 rounded-full bg-primary/10 p-4">
          <Heart className="h-10 w-10 text-primary" />
        </div>
        <h2 className="text-2xl font-semibold tracking-tight">Choose your AI Persona</h2>
        <p className="mt-2 text-muted-foreground">
          Select a persona for the AI or start typing below to begin. Your chat history will be displayed here.
        </p>

        <div className="mt-8 w-full space-y-3">
          <p className="text-sm font-medium text-muted-foreground">Suggested system prompts:</p>
          <div className="grid grid-cols-2 gap-2 md:grid-cols-3">
            {suggestedSystemPrompts.map((prompt, index) => {
              const Icon = prompt.icon;
              return (
                <Button
                  key={index}
                  variant="outline"
                  className="h-auto flex-col gap-2 rounded-xl p-4 text-left hover-elevate active-elevate-2"
                  onClick={() => handlePromptClick(prompt)}
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
