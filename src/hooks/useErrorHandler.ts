
import { useState, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { SecureErrorHandler, SanitizedError, ErrorContext } from '@/utils/errorHandling';

interface UseErrorHandlerReturn {
  error: SanitizedError | null;
  isLoading: boolean;
  handleError: (error: Error | unknown, context?: ErrorContext) => void;
  clearError: () => void;
  executeWithErrorHandling: <T>(
    asyncFn: () => Promise<T>,
    context?: ErrorContext,
    options?: { showToast?: boolean; retryCount?: number }
  ) => Promise<T | null>;
}

export const useErrorHandler = (): UseErrorHandlerReturn => {
  const [error, setError] = useState<SanitizedError | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleError = useCallback((error: Error | unknown, context?: ErrorContext) => {
    const sanitizedError = SecureErrorHandler.handleError(error, context);
    setError(sanitizedError);
    return sanitizedError;
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const executeWithErrorHandling = useCallback(async <T>(
    asyncFn: () => Promise<T>,
    context?: ErrorContext,
    options: { showToast?: boolean; retryCount?: number } = {}
  ): Promise<T | null> => {
    const { showToast = true, retryCount = 0 } = options;
    
    setIsLoading(true);
    clearError();

    try {
      const result = await asyncFn();
      setIsLoading(false);
      return result;
    } catch (error) {
      const sanitizedError = handleError(error, context);
      setIsLoading(false);

      if (showToast) {
        toast({
          title: "Error",
          description: sanitizedError.message,
          variant: "destructive",
        });
      }

      // Implement retry logic for retryable errors
      if (retryCount > 0 && SecureErrorHandler.isRetryableError(sanitizedError.code || '')) {
        await new Promise(resolve => setTimeout(resolve, 1000)); // Wait 1 second
        return executeWithErrorHandling(asyncFn, context, { ...options, retryCount: retryCount - 1 });
      }

      return null;
    }
  }, [handleError, clearError, toast]);

  return {
    error,
    isLoading,
    handleError,
    clearError,
    executeWithErrorHandling,
  };
};
