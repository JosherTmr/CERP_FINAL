
import { useState, useEffect, useCallback } from 'react';

interface UseApiResult<T> {
    data: T | null;
    loading: boolean;
    error: string | null;
    refetch: () => void;
}

/**
 * Generic hook for fetching data from the API.
 * Automatically triggers on mount and when `deps` change.
 */
export function useApi<T>(
    fetcher: () => Promise<T>,
    deps: any[] = []
): UseApiResult<T> {
    const [data, setData] = useState<T | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchData = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const result = await fetcher();
            setData(result);
        } catch (err: any) {
            setError(err.message || 'Error al cargar los datos');
            console.error('API Error:', err);
        } finally {
            setLoading(false);
        }
    }, deps);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    return { data, loading, error, refetch: fetchData };
}
