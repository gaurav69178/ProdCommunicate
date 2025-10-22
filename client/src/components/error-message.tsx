import { AlertCircle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ErrorMessageProps {
  message: string;
  onRetry?: () => void;
}

export function ErrorMessage({ message, onRetry }: ErrorMessageProps) {
  return (
    <div className="flex w-full animate-fade-in justify-center px-4 py-3">
      <div className="flex max-w-md items-center gap-3 rounded-full border border-destructive/20 bg-destructive/10 px-4 py-2" data-testid="error-message">
        <AlertCircle className="h-4 w-4 flex-shrink-0 text-destructive" />
        <p className="flex-1 text-sm text-destructive">{message}</p>
        {onRetry && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onRetry}
            className="h-8 gap-2 hover-elevate active-elevate-2"
            data-testid="button-retry"
          >
            <RefreshCw className="h-3 w-3" />
            Retry
          </Button>
        )}
      </div>
    </div>
  );
}
