"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/app/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/app/components/ui/chart";
import { useAuth } from "@/app/hooks/useAuth";

import { TrendingUp } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import {
  CartesianGrid,
  LabelList,
  Line,
  LineChart,
  ResponsiveContainer,
  XAxis,
} from "recharts";
import {
  fetchAllCallsPaginated,
  fetchCallsByIdTecnico,
  findLastSevenCalls,
} from "../chat/_actions/api";
import { ChamadosDto } from "../chat/_actions/dtos/chamado.dto";
import { LastSevenCallsDto } from "../chat/_actions/dtos/lastSevenCalls.dto";
import { User } from "../chat/_actions/dtos/user.interface";
import { PerfilEnum } from "../chat/_services/enums/perfil.enum";
import { eventManager } from "../chat/_services/socket/eventManager";
import { socketService } from "../chat/_services/socket/socketService";
import ChatItem from "./_components/cardCall";
import { TableLastCalls } from "./_components/table";

export default function Dashboard() {
  const { user, token, isAuthenticated } = useAuth();
  const [calls, setCalls] = useState<ChamadosDto[] | null>(null);
  const [opennedCall, setOpennedCalls] = useState<ChamadosDto[] | null>(null);
  const [lastSevenCall, setLasSevenCall] = useState<LastSevenCallsDto[] | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    //console.log("USER LOGADO 11: ", user);
    if (user != null && user!.type != PerfilEnum.TECNICO) {
      setError("Erro nos dados do usuário!");
    }
  }, [user]);

  useEffect(() => {
    //connectSocket();
    eventManager.on("connect", loginSocket);
    eventManager.on("open-call", onCallOpen);
    eventManager.on("accepted-call", onCallUpdated);
    eventManager.on("closed-call", onCallClosed);
    eventManager.on("user", onUser);

    return () => {
      eventManager.off("connect", loginSocket);
      eventManager.off("accepted-call", onCallUpdated);
      eventManager.off("open-call", onCallOpen);
      eventManager.off("closed-call", onCallClosed);
      eventManager.off("user", onUser);

      //socketService.disconnect();
    };
  }, []);

  const onCallOpen = useCallback((data: ChamadosDto) => {
    console.log("Chamado aberto: ", data);

    // Filtra chamados onde tecnico_responsavel === null e o CNPJ está na blacklist

    const notificationSound = new Audio("/notify-new-call.mp3");
    notificationSound.play();

    //playSound();
    window.parent.postMessage({ type: "NEW_CALL_NOTIFICATION" }, "*");

    setCalls((prev) => {
      const newCall: ChamadosDto = {
        ...data,
        unread_messages: 0,
      };
      return prev ? [...prev, newCall] : [newCall];
    });

    setOpennedCalls((prev) => {
      const newCall: ChamadosDto = {
        ...data,
        unread_messages: 0,
      };
      return prev ? [...prev, newCall] : [newCall];
    });
  }, []);

  const onCallUpdated = useCallback((data: ChamadosDto) => {
    setCalls((prev) =>
      prev ? prev.map((c) => (c.id_chamado === data.id_chamado ? data : c)) : []
    );

    setOpennedCalls(
      (prev) => prev?.filter((c) => c.id_chamado !== data.id_chamado) || []
    );
  }, []);

  const onCallClosed = useCallback((data: ChamadosDto) => {
    setCalls((prev) =>
      prev ? prev.map((c) => (c.id_chamado === data.id_chamado ? data : c)) : []
    );
  }, []);

  const loginSocket = async () => {
    const data = {
      nome: user?.nome || "", // Se for null, usa string vazia
      cnpj: null, // Se for null, usa undefined (para campo opcional)
      type: PerfilEnum.TECNICO,
      id: user?.id || "", // Garante que seja um dos valores esperados
    };
    socketService.login(data);
  };

  useEffect(() => {
    try {
      socketService.connect();
    } catch (error) {}

    return () => {
      socketService.disconnect();
    };
  }, []);

  const onUser = useCallback(async (data: User) => {
    //setUserLogged(data);

    await fetchData(data);
  }, []);

  const fetchData = async (user: User) => {
    try {
      // Chama a função do servidor passando os parâmetros

      const result = await fetchAllCallsPaginated();
      const lastCalls = await findLastSevenCalls();
      console.log("CALLS: ", result);
      const opennedCalls = await fetchCallsByIdTecnico();

      console.log("CALL ABERTAS: ", opennedCalls);

      setCalls(result);
      setLasSevenCall(lastCalls);
      setOpennedCalls(opennedCalls);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const chartConfig = {
    desktop: {
      label: "Desktop",
      color: "blue",
    },
    mobile: {
      label: "Mobile",
      color: "blue",
    },
  } satisfies ChartConfig;
  return (
    <div className="flex flex-col w-full h-screen gap-4 p-4 overflow-hidden">
      {/* Se houver chamados abertos */}
      {opennedCall && opennedCall.length > 0 && (
        <div className="flex flex-row flex-wrap gap-4 p-2 rounded-xl dark:bg-neutral-700 overflow-auto md:h-[33%]">
          {opennedCall.map((call) => (
            <div key={call.id_chamado} className="flex-1 min-w-[250px] h-full">
              <ChatItem chamado={call} />
            </div>
          ))}
        </div>
      )}

      {/* Gráfico de chamados */}
      <Card className="flex flex-col flex-1 min-h-0 dark:bg-neutral-700">
        <CardHeader>
          <CardTitle>Chamados</CardTitle>
          <CardDescription>05/07/2025 - 11/07/2025</CardDescription>
        </CardHeader>

        <CardContent className="flex-1 min-h-0">
          <div className="w-full h-full">
            <ResponsiveContainer width="100%" height="100%">
              <ChartContainer config={chartConfig}>
                <LineChart
                  data={lastSevenCall ?? []}
                  margin={{ top: 20, left: 12, right: 12 }}
                >
                  <CartesianGrid vertical={false} />
                  <XAxis
                    dataKey="data"
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                    tickFormatter={(value) => value}
                  />
                  <ChartTooltip
                    cursor={false}
                    content={<ChartTooltipContent indicator="line" />}
                  />
                  <Line
                    dataKey="total"
                    type="natural"
                    stroke="hsl(var(--chart-1))"
                    strokeWidth={2}
                    dot={{ fill: "white" }}
                    activeDot={{ r: 6 }}
                  >
                    <LabelList
                      position="top"
                      offset={12}
                      className="fill-foreground"
                      fontSize={12}
                    />
                  </Line>
                </LineChart>
              </ChartContainer>
            </ResponsiveContainer>
          </div>
        </CardContent>

        <CardFooter className="flex-col items-start gap-2 text-sm">
          <div className="flex gap-2 leading-none font-medium">
            Chamados nos últimos 7 dias <TrendingUp className="h-4 w-4" />
          </div>
        </CardFooter>
      </Card>

      {/* Tabela de chamados recentes */}
      <div className="flex-1 min-h-0 overflow-auto rounded-xl dark:bg-neutral-700">
        <TableLastCalls calls={calls} />
      </div>
    </div>
  );
}
