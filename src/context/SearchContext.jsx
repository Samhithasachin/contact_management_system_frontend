import { createContext, useContext, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

const SearchContext = createContext(null);

export function SearchProvider({ children }) {
  const [query, setQuery] = useState("");
  const location = useLocation();

  useEffect(() => {
    setQuery("");
  }, [location.pathname]);

  return <SearchContext.Provider value={{ query, setQuery }}>{children}</SearchContext.Provider>;
}

export function useSearch() {
  const ctx = useContext(SearchContext);
  if (!ctx) throw new Error("useSearch must be used within SearchProvider");
  return ctx;
}
