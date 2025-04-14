"use client";

import Loading from "@/app/(pages)/chat/_components/loading";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import { yupResolver } from "@hookform/resolvers/yup";
import { Loader } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";

import { useAuth } from "@/app/hooks/useAuth";
import { ChamadosDto } from "../chat/_actions/dtos/chamado.dto";
import ErrorPage from "../chat/_components/error-page";
import { createChamado, fetchCallByIdOperadorAndCnpj } from "./_actions/api";
import { CreateChamadoDto } from "./_actions/dtos/create-chamado.dto";

const schema = yup.object().shape({
  contato: yup
    .string()
    .required("Contato é obrigatório")
    .test("validarContato", "Informe um e-mail ou telefone válido", (value) => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      const phoneRegex = /^\d{10,11}$/;
      return emailRegex.test(value) || phoneRegex.test(value);
    }),
});

export default function Home() {
  const { user, token } = useAuth();
  const [error, setError] = useState("");

  useEffect(() => {
    //console.log("USER LOGADO 11: ", user);
    if (!user) {
      setError("Erro nos dados do usuário!");
    }
  }, [user]);
  const router = useRouter();
  // const searchParams = useSearchParams();
  // const cnpj = searchParams.get("cnpj");
  // const idOperador = searchParams.get("idOperador");
  // const nomeOperador = searchParams.get("nomeOperador");
  // const linkOperador = searchParams.get("linkOperador");
  const [chamado, setChamado] = useState<ChamadosDto | null>(null);
  const [loading, setLoading] = useState(true);

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (user?.cnpj && user.id) {
      handleLogin();
    } else setError("Erro nos dados do usuário!");
  }, [user?.cnpj, user?.id]);

  const handleLogin = async () => {
    try {
      // Chama a função do servidor passando os parâmetros

      const result = await fetchCallByIdOperadorAndCnpj(
        Number(user?.id),
        user?.cnpj!
      );

      setChamado(result);
      console.log("CHAMADO: ", result);
      if (result) {
        router.push(`/chat/operador?data=${token}`);
        //router.push(`/chat/operador?data=${token}&novoChamado=true`);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Definição do schema de validação com Yup
  const schema = yup.object().shape({
    contato: yup
      .string()
      .required("Contato é obrigatório")
      .test(
        "validarContato",
        "Informe um e-mail ou telefone válido",
        (value) => {
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          const phoneRegex = /^\d{10,11}$/;
          return emailRegex.test(value) || phoneRegex.test(value);
        }
      ),
  });

  // useForm para gerenciar o formulário
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  if (loading)
    return (
      <div className="h-full">
        <Loading />
      </div>
    );
  if (error)
    return (
      <div>
        <ErrorPage message={error} />
      </div>
    );

  async function onSubmit(data: any) {
    setIsLoading(true); // Ativa o loading

    const chamado: CreateChamadoDto = {
      nome_operador: user?.nome!, // Nome do operador
      cnpj_operador: user?.cnpj!, // CNPJ do operador
      contato: data.contato, // Contato do cliente
      link_operador: user?.link_operador || "", // Link do operador
      id_operador: user?.id!, // ID do operador
    };

    // Chama a função do servidor passando os parâmetros
    try {
      const result = await createChamado(chamado);
      if (result) {
        router.push(`/chat/operador?data=${token}&novoChamado=true`);
      }
    } catch (error) {
    } finally {
      setIsLoading(false);
    }
  }
  return (
    <div className="flex items-center justify-center min-h-screen p-4 sm:p-10 bg-gray-100">
      {!chamado && (
        <main className="flex flex-col items-center w-full h-full">
          <div className="flex items-center justify-center w-full h-full">
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="w-full h-full flex flex-col justify-center bg-white shadow-lg border rounded-none sm:rounded-lg sm:w-[450px] sm:h-auto p-6"
            >
              {/* Logo */}
              <div className="flex justify-center items-center mb-6">
                <Image
                  src="/binar-gptw.svg"
                  alt="Next.js logo"
                  width={180}
                  height={38}
                  priority
                />
              </div>

              {/* Nome do Operador */}
              <div className="flex flex-col space-y-1.5 mb-4">
                <Label htmlFor="nome">Nome operador</Label>
                <Input id="nome" disabled value={user?.nome!} />
              </div>

              {/* Contato */}
              <div className="flex flex-col space-y-1.5 mb-6">
                <Label htmlFor="contato">Contato (Email ou Telefone)</Label>
                <Input
                  id="contato"
                  placeholder="Contato Email ou Telefone"
                  {...register("contato")}
                />
                {errors.contato && (
                  <p className="text-red-500 text-sm">
                    {errors.contato.message}
                  </p>
                )}
              </div>

              {/* Botão */}
              <Button
                type="submit"
                className="bg-orange-500 w-full flex items-center justify-center gap-2 mt-auto"
                disabled={isLoading}
              >
                {isLoading ? (
                  <Loader className="animate-spin" size={18} />
                ) : (
                  "Iniciar chat"
                )}
              </Button>
            </form>
          </div>
        </main>
      )}
    </div>
  );
}
