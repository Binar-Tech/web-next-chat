"use client";

import { ChartConfig } from "@/app/components/ui/chart";
import { useAuth } from "@/app/hooks/useAuth";

import { useCallback, useEffect, useState } from "react";
import {
  fetchAllCallsPaginated,
  fetchCallsByIdTecnico,
  findLastSevenCalls,
} from "../chat/_actions/api";
import { ChamadosDto } from "../chat/_actions/dtos/chamado.dto";
import { LastSevenCallsDto } from "../chat/_actions/dtos/lastSevenCalls.dto";
import { User } from "../chat/_actions/dtos/user.interface";
import ErrorPage from "../chat/_components/error-page";
import Loading from "../chat/_components/loading";
import { PerfilEnum } from "../chat/_services/enums/perfil.enum";
import { eventManager } from "../chat/_services/socket/eventManager";
import { socketService } from "../chat/_services/socket/socketService";
import ChatItem from "./_components/cardCall";
import { LineChartCalls } from "./_components/lineChart";
import { TableLastCalls } from "./_components/table";

export default function Dashboard() {
  const { user, token, isAuthenticated } = useAuth();
  const [calls, setCalls] = useState<ChamadosDto[]>([]);
  const [opennedCall, setOpennedCalls] = useState<ChamadosDto[]>([]);
  const [lastSevenCall, setLasSevenCall] = useState<LastSevenCallsDto[]>([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    //console.log("USER LOGADO 11: ", user);
    if (user != null && user!.type != PerfilEnum.TECNICO) {
      setError("Erro nos dados do usuário!");
    }
  }, [user]);
  useEffect(() => {
    const interval = setInterval(() => {
      if (user) {
        fetchData(); // Atualiza os dados
      }
    }, 5 * 60 * 1000); // 5 minutos

    return () => clearInterval(interval);
  }, [user]);

  useEffect(() => {
    socketService.connect();

    eventManager.on("connect", loginSocket);
    eventManager.on("open-call", onCallOpen);
    eventManager.on("accepted-call", onCallUpdated);
    eventManager.on("closed-call", onCallClosed);
    eventManager.on("user", onUser);

    return () => {
      socketService.disconnect();
      eventManager.off("connect", loginSocket);
      eventManager.off("accepted-call", onCallUpdated);
      eventManager.off("open-call", onCallOpen);
      eventManager.off("closed-call", onCallClosed);
      eventManager.off("user", onUser);
    };
  }, []);

  const onCallOpen = useCallback((data: ChamadosDto) => {
    const notificationSound = new Audio("/notify-new-call.mp3");
    notificationSound.play();

    window.parent.postMessage({ type: "NEW_CALL_NOTIFICATION" }, "*");

    const newCall: ChamadosDto = { ...data, unread_messages: 0 };

    setCalls((prev) => (prev ? [...prev, newCall] : [newCall]));
    setOpennedCalls((prev) => (prev ? [...prev, newCall] : [newCall]));
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
    console.log("CHAMADO FECHADO: ", data);
    setCalls((prev) =>
      prev
        ? prev.map((c) =>
            c.id_chamado === data.id_chamado ? { ...c, status: data.status } : c
          )
        : []
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

  const onUser = useCallback(async (data: User) => {
    //setUserLogged(data);

    await fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // Chama a função do servidor passando os parâmetros

      const result = await fetchAllCallsPaginated();
      const lastCalls = await findLastSevenCalls();
      console.log("CALLS: ", result);
      const opennedCalls = await fetchCallsByIdTecnico();

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
  if (loading) {
    return <Loading />;
  }
  if (error) {
    return <ErrorPage message={error} />;
  }
  return (
    <div className="flex flex-col w-full h-screen gap-4 p-4 overflow-hidden">
      {/* Se houver chamados abertos */}
      {opennedCall && opennedCall.length > 0 && (
        <div className="flex flex-row flex-wrap gap-4 p-2 rounded-xl dark:bg-neutral-700 overflow-auto md:h-[25%]">
          {opennedCall.map((call) => (
            <div key={call.id_chamado} className="flex-1 min-w-[250px] h-full">
              <ChatItem chamado={call} />
            </div>
          ))}
        </div>
      )}

      {/* Gráfico de chamados */}
      <LineChartCalls lastSevenCall={lastSevenCall} />

      {/* Tabela de chamados recentes */}
      <div className="flex-1 min-h-0 overflow-auto rounded-xl dark:bg-neutral-700">
        <TableLastCalls calls={calls} />
      </div>
    </div>
  );
}
