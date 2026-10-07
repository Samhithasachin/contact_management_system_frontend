import { useEffect, useState } from "react";
import { searchCompanies } from "../api/companies";
import { useDebounce } from "./useDebounce";

export function useCompanySearch(query) {
  const debounced = useDebounce(query, 350);
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!debounced?.trim()) {
      setCompanies([]);
      setError(null);
      return;
    }
    let cancelled = false;
    setLoading(true);
    setError(null);
    searchCompanies(debounced)
      .then((data) => {
        if (!cancelled) setCompanies(data);
      })
      .catch((err) => {
        if (!cancelled) setError(err);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [debounced]);

  return { companies, loading, error };
}
