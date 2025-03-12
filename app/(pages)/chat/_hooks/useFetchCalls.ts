import { useEffect, useState } from "react";
import { ChamadosDto } from "../../home/_actions/api";
import { fetchOpennedCals } from "../_actions/api";

export function useFetchCalls() {
  const [data, setData] = useState<ChamadosDto[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await fetchOpennedCals();
        setData(result);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return { data, loading, error };
}
