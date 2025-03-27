// hooks/useSearchParams.tsx
import { useSearchParams } from "next/navigation";

// Hook customizado para acessar um parâmetro de searchParams
export const useSearchParam = (param: string) => {
  const searchParams = useSearchParams();
  return searchParams.get(param);
};
