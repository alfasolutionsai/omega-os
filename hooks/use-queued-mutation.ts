import { useState, useCallback } from 'react';
import { withRateLimit } from '@/lib/rate-limiter';

interface UseQueuedMutationOptions<TData, TVariables> {
  mutationFn: (variables: TVariables) => Promise<TData>;
  onSuccess?: (data: TData) => void;
  onError?: (error: Error) => void;
}

interface UseQueuedMutationResult<TData, TVariables> {
  mutate: (variables: TVariables) => Promise<void>;
  isLoading: boolean;
  error: Error | null;
  data: TData | null;
}

export function useQueuedMutation<TData, TVariables>(
  options: UseQueuedMutationOptions<TData, TVariables>
): UseQueuedMutationResult<TData, TVariables> {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [data, setData] = useState<TData | null>(null);

  const mutate = useCallback(async (variables: TVariables) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Wrap the mutation function in our rate limiter
      const result = await withRateLimit(() => options.mutationFn(variables));
      setData(result);
      options.onSuccess?.(result);
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      setError(error);
      options.onError?.(error);
    } finally {
      setIsLoading(false);
    }
  }, [options]);

  return { mutate, isLoading, error, data };
}