"use client";

import Loading from "@/app/(pages)/chat/_components/loading";
import { Button } from "@/app/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/app/components/ui/card";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import { yupResolver } from "@hookform/resolvers/yup";
import { Loader } from "lucide-react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";

import { ChamadosDto } from "../chat/_actions/dtos/chamado.dto";
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
  const router = useRouter();
  const searchParams = useSearchParams();
  const cnpj = searchParams.get("cnpj");
  const idOperador = searchParams.get("idOperador");
  const nomeOperador = searchParams.get("nomeOperador");
  const linkOperador = searchParams.get("linkOperador");
  const [chamado, setChamado] = useState<ChamadosDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (cnpj && idOperador) {
      handleLogin();
    }
  }, [cnpj, idOperador]);

  const handleLogin = async () => {
    try {
      // Chama a função do servidor passando os parâmetros

      const result = await fetchCallByIdOperadorAndCnpj(
        Number(idOperador),
        cnpj!
      );
      setChamado(result);
      if (result) {
        router.push(
          `/chat/operador?cnpj=${cnpj}&nomeOperador=${nomeOperador}&idOperador=${idOperador}`
        );
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
        <p>Erro: {error}</p>
      </div>
    );

  async function onSubmit(data: any) {
    setIsLoading(true); // Ativa o loading
    console.log("Form enviado:", data);
    const chamado: CreateChamadoDto = {
      nome_operador: nomeOperador!, // Nome do operador
      cnpj_operador: cnpj!, // CNPJ do operador
      contato: data.contato, // Contato do cliente
      link_operador: linkOperador || "", // Link do operador
      id_operador: idOperador!, // ID do operador
    };

    // Chama a função do servidor passando os parâmetros
    try {
      const result = await createChamado(chamado);
      if (result) {
        router.push(
          `/chat/operador?cnpj=${cnpj}&nomeOperador=${nomeOperador}&idOperador=${idOperador}&novoChamado=true`
        );
      }
    } catch (error) {
      console.log("Erro ao criar chamado", error);
    } finally {
      setIsLoading(false);
    }
  }
  return (
    <div className="flex items-center justify-center h-screen p-4 sm:p-10">
      {!chamado && (
        <main className="flex flex-col items-center sm:items-start w-full">
          <div className="flex items-center justify-center w-full">
            <form onSubmit={handleSubmit(onSubmit)}>
              <Card className="w-full h-auto sm:w-[450px] max-w-md bg-white sm:rounded-lg sm:shadow-lg sm:border">
                <CardHeader>
                  <CardTitle className="justify-center">
                    <Image
                      src="/binar-gptw.svg"
                      alt="Next.js logo"
                      width={180}
                      height={38}
                      priority
                    />
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid w-full items-center gap-4">
                    {/* Nome do Operador */}
                    <div className="flex flex-col space-y-1.5">
                      <Label htmlFor="nome">Nome operador</Label>
                      <Input id="nome" disabled value={nomeOperador!} />
                    </div>

                    {/* Contato */}
                    <div className="flex flex-col space-y-1.5">
                      <Label htmlFor="contato">
                        Contato (Email ou Telefone)
                      </Label>
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
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button
                    type="submit"
                    className="bg-orange-500 w-full flex items-center justify-center gap-2"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <Loader className="animate-spin" size={18} />
                    ) : (
                      "Iniciar chat"
                    )}
                  </Button>
                </CardFooter>
              </Card>
            </form>
          </div>
        </main>
      )}
    </div>
  );
}
