import { useCallback, useEffect, useState } from "react";
import { api } from "../api/client";

// With no username, fetches the logged-in user's own data (admin dashboard).
// With a username, fetches that user's public portfolio (/u/:username).
export function useHomeContent(username) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [notFound, setNotFound] = useState(false);

  const refetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    setNotFound(false);
    try {
      const path = username ? `/portfolio/${username}/home` : "/me/home";
      const { data } = await api.get(path);
      setData(data);
    } catch (err) {
      if (err.status === 404) setNotFound(true);
      else setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [username]);

  useEffect(() => {
    // Fetch on mount and whenever the target username changes — no external-store
    // subscription API exists for this, a one-shot fetch is correct here.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    refetch();
  }, [refetch]);

  return { ...(data || {}), loading, error, notFound, refetch };
}
