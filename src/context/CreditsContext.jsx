import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { getCreditTotal } from "../api/credits";
import { useAuth } from "./AuthContext";

const CreditsContext = createContext(null);

export function CreditsProvider({ children }) {
  const { isAuthenticated } = useAuth();
  const [balance, setBalance] = useState(0);
  const [loading, setLoading] = useState(false);

  const refresh = useCallback(async () => {
    if (!isAuthenticated) return;
    setLoading(true);
    try {
      const data = await getCreditTotal();
      setBalance(data.totalPoints ?? 0);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (isAuthenticated) refresh();
    else setBalance(0);
  }, [isAuthenticated, refresh]);

  return (
    <CreditsContext.Provider value={{ balance, loading, refresh, setBalance }}>
      {children}
    </CreditsContext.Provider>
  );
}

export function useCredits() {
  const ctx = useContext(CreditsContext);
  if (!ctx) throw new Error("useCredits must be used within CreditsProvider");
  return ctx;
}
