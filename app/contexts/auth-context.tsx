"use client";
import { useSearchParams } from "next/navigation";
import { createContext, useEffect, useState } from "react";
import { getLoggedUserByToken } from "../(pages)/chat/_actions/api";
import { UserAuthDto } from "../(pages)/chat/_actions/dtos/user-auth.dto";
import Loading from "../(pages)/chat/_components/loading";

interface AuthContextData {
  user: UserAuthDto | null;
  logout: () => void;
  isAuthenticated: boolean;
  token?: string;
}

const SECRET_KEY = "binar132878";

export const AuthContext = createContext<AuthContextData | undefined>(
  undefined
);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<UserAuthDto | null>(null);
  const [token, setToken] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true); // Estado de carregamento
  const [error, setError] = useState<string | null>(null);
  const searchParams = useSearchParams();

  useEffect(() => {
    const tokenjwt = searchParams.get("data");
    console.log("Token JWT recebido:", tokenjwt);

    if (tokenjwt) {
      setToken(tokenjwt);

      const verifyToken = async () => {
        try {
          // Verifica e decodifica o token com jose
          const result = await getLoggedUserByToken(tokenjwt);
          if (result) {
            console.log("RETORNO: ", result);
            setUser(result);
          }
        } catch (error) {
          console.error("Erro ao verificar o token:", error);
          setUser(null);
          setError(error instanceof Error ? error.message : String(error));
        } finally {
          setIsLoading(false);
        }
      };

      verifyToken();
    } else {
      console.error("Token não encontrado na URL");
      setUser(null);
      setIsLoading(false);
    } // Finaliza o carregamento independentemente do token
  }, [searchParams]); // Re-executa o efeito se searchParams mudar

  const logout = () => {
    window.location.href = "/home"; // Redireciona para login
  };

  if (isLoading) {
    return <Loading />; // Exibe uma tela de carregamento
  }

  return (
    <AuthContext.Provider
      value={{ token, user, logout, isAuthenticated: !!user }}
    >
      {children}
    </AuthContext.Provider>
  );
};
