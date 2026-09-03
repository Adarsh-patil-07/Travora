import { AlertTriangle } from 'lucide-react';
import Button from './Button';

interface ErrorFallbackProps {
  message?: string;
  onRetry?: () => void;
}

export default function ErrorFallback({ 
  message = 'Something went wrong.', 
  onRetry 
}: ErrorFallbackProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <AlertTriangle className="w-10 h-10 text-[#E07A3A] mb-4" />
      <p className="text-[#6B6B6B] text-base mb-6">{message}</p>
      {onRetry && (
        <Button variant="secondary" size="sm" onClick={onRetry}>
          Try again
        </Button>
      )}
    </div>
  );
}
