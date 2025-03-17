"use client";

import Loading from "@/app/(pages)/chat/_components/loading";
import { Button } from "@/app/_components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/app/_components/ui/card";
import { Input } from "@/app/_components/ui/input";
import { Label } from "@/app/_components/ui/label";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { ChamadosDto, fetchChatsFromApi } from "./_actions/api";

export default function Home() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const cnpj = searchParams.get("cnpj");
  const idOperador = searchParams.get("idOperador");

  const [data, setData] = useState<ChamadosDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [name, setName] = useState("MARCOS ALBRECHT");

  useEffect(() => {
    if (cnpj && idOperador) {
      // Chama a Server Action
      const fetchData = async () => {
        try {
          // Chama a função do servidor passando os parâmetros
          const result = await fetchChatsFromApi(cnpj, idOperador);
          setData(result);
          router.push("/chat/operador");
        } catch (err: any) {
          setError(err.message);
        } finally {
          setLoading(false);
        }
      };

      fetchData();
    }
  }, [cnpj, idOperador]);

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

  function handleClickButton() {
    console.log("CLICOU NO BOTAO");
  }
  return (
    <div className="flex items-center justify-center h-screen p-4 sm:p-10 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col items-center sm:items-start w-full">
        <div className="flex items-center justify-center w-full">
          <Card className="w-full h-auto sm:w-[450px] max-w-md bg-white sm:rounded-lg sm:shadow-lg sm:border">
            <CardHeader>
              <CardTitle className="justify-center">
                <div>
                  <Image
                    src="/binar-gptw.svg"
                    alt="Next.js logo"
                    width={180}
                    height={38}
                    priority
                  />
                </div>
              </CardTitle>
              <CardDescription></CardDescription>
            </CardHeader>
            <CardContent>
              <form>
                <div className="grid w-full items-center gap-4">
                  <div className="flex flex-col space-y-1.5">
                    <Label htmlFor="name">Nome</Label>
                    <Input
                      id="name"
                      placeholder="Nome"
                      disabled={true}
                      onChange={(value) => setName}
                    />
                  </div>
                  <div className="flex flex-col space-y-1.5">
                    <Label htmlFor="name">Contato Email/Telefone</Label>
                    <Input id="name" placeholder="Contato Email/Telefone" />
                  </div>
                </div>
              </form>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button className="bg-orange-500">Iniciar chat</Button>
            </CardFooter>
          </Card>
        </div>
      </main>
    </div>
  );
}
