"use client";
import { jwtVerify } from "jose";
import { useSearchParams } from "next/navigation";
import { createContext, useEffect, useState } from "react";
import Loading from "../(pages)/chat/_components/loading";
import { PerfilEnum } from "../(pages)/chat/_services/enums/perfil.enum";

interface AuthContextData {
  user: User | null;
  logout: () => void;
  isAuthenticated: boolean;
  token?: string;
}

interface User {
  id: string;
  nome: string;
  cnpj?: string | null;
  type: PerfilEnum;
  link_operador?: string | null;
}

const SECRET_KEY = "binar132878";

export const AuthContext = createContext<AuthContextData | undefined>(
  undefined
);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true); // Estado de carregamento
  const searchParams = useSearchParams();

  useEffect(() => {
    const tokenjwt = searchParams.get("data");
    console.log("Token JWT recebido:", tokenjwt);

    if (tokenjwt) {
      setToken(tokenjwt);

      const verifyToken = async () => {
        try {
          // Verifica e decodifica o token com jose
          const { payload } = await jwtVerify(
            tokenjwt,
            new TextEncoder().encode(SECRET_KEY) // Chave secreta como Uint8Array
          );

          if (payload && typeof payload === "object" && "id" in payload) {
            setUser(payload as unknown as User);
            console.log("Token válido:", payload);
          } else {
            console.error("Estrutura do token inválida");
            setUser(null);
          }
        } catch (error) {
          //console.error("Erro ao verificar o token:", error);
          setUser(null);
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
