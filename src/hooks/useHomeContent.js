import { useCallback, useEffect, useState } from "react";
import { api } from "../api/client";

export function useHomeContent() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const refetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await api.get("/home");
      setData(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // Fetch on mount — no external-store subscription API exists for this, a one-shot fetch is correct here.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    refetch();
  }, [refetch]);

  return { ...(data || {}), loading, error, refetch };
}
