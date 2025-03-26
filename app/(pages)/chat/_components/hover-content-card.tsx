import { HoverCardContent } from "@/app/_components/ui/hover-card";
import {
  LucideCheckCircle,
  LucideClock,
  LucideGlobe,
  LucideLink,
  LucideMail,
  LucidePhone,
  LucideUser,
  LucideXCircle,
} from "lucide-react";
import { useEffect, useState } from "react";
import { ChamadosDto } from "../_actions/dtos/chamado.dto";

interface HoverContentCardProps {
  chamado: ChamadosDto;
}

interface TimerProps {
  dataAbertura: string;
}

export function ChatItemHoverContentCard({ chamado }: HoverContentCardProps) {
  const formatTimeElapsed = (secondsElapsed: number) => {
    const days = Math.floor(secondsElapsed / 86400);
    const hours = Math.floor((secondsElapsed % 86400) / 3600);
    const minutes = Math.floor((secondsElapsed % 3600) / 60);
    const seconds = secondsElapsed % 60;

    return `${days}d ${hours}h ${minutes}m ${seconds}s`;
  };

  const Timer = ({ dataAbertura }: TimerProps) => {
    const [timeElapsed, setTimeElapsed] = useState("");

    useEffect(() => {
      const abertura = new Date(dataAbertura).getTime();

      const updateTimer = () => {
        const now = new Date().getTime();
        const diffInSeconds = Math.floor((now - abertura) / 1000);
        setTimeElapsed(formatTimeElapsed(diffInSeconds));
      };

      updateTimer(); // Atualiza imediatamente ao montar
      const interval = setInterval(updateTimer, 1000);

      return () => clearInterval(interval);
    }, [dataAbertura]);

    return <span className="font-semibold">{timeElapsed}</span>;
  };
  return (
    <div>
      <HoverCardContent className="p-4 space-y-3 w-150">
        {/* Nome em destaque */}
        <h3 className="text-xl font-bold text-blue-600 dark:text-blue-400">
          {chamado.nome_operador}
        </h3>

        <div className="text-sm text-gray-600 dark:text-gray-300 space-y-2">
          <p className="flex items-center gap-2">
            <LucideGlobe
              size={16}
              className="text-gray-500 dark:text-gray-400"
            />
            <span className="font-medium text-gray-700 dark:text-gray-200">
              Empresa:
            </span>{" "}
            {chamado.empresa.fantasia}
          </p>
          <p className="flex items-center gap-2">
            <LucideUser
              size={16}
              className="text-gray-500 dark:text-gray-400"
            />
            <span className="font-medium text-gray-700 dark:text-gray-200">
              CNPJ:
            </span>{" "}
            {chamado.cnpj_operador}
          </p>
          <p className="flex items-center gap-2">
            <LucidePhone
              size={16}
              className="text-gray-500 dark:text-gray-400"
            />
            <span className="font-medium text-gray-700 dark:text-gray-200">
              Contato:
            </span>{" "}
            {chamado.contato}
          </p>
          <p className="flex items-center gap-2">
            <LucideMail
              size={16}
              className="text-gray-500 dark:text-gray-400"
            />
            <span className="font-medium text-gray-700 dark:text-gray-200">
              Técnico:
            </span>{" "}
            {chamado.tecnico?.name ?? "Não atribuído"}
          </p>
          <p className="flex items-center gap-2">
            <LucideLink
              size={16}
              className="text-gray-500 dark:text-gray-400"
            />
            <span className="font-medium text-gray-700 dark:text-gray-200">
              Link:
            </span>{" "}
            <a
              href={`https://${chamado.link_operador}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 "
            >
              {chamado.link_operador}
            </a>
          </p>
        </div>

        {/* Status do Chamado */}
        <div className="flex items-center gap-2 text-sm">
          <span className="font-medium text-gray-700 dark:text-gray-200">
            Status:
          </span>
          {chamado.status === "ABERTO" && (
            <span className="flex items-center gap-1 text-green-600 dark:text-green-400">
              <LucideCheckCircle size={16} /> Aberto
            </span>
          )}
          {chamado.status === "FECHADO" && (
            <span className="flex items-center gap-1 text-red-500 dark:text-red-400">
              <LucideXCircle size={16} /> Fechado
            </span>
          )}
          {chamado.status === "Pendente" && (
            <span className="flex items-center gap-1 text-yellow-500 dark:text-yellow-400">
              <LucideClock size={16} /> Pendente
            </span>
          )}
        </div>

        {/* Datas e ID do Ticket */}
        <div className="text-xs text-gray-500 dark:text-gray-400">
          <p>
            ID Chamado:{" "}
            <span className="font-semibold text-gray-700 dark:text-gray-300">
              {chamado.id_chamado}
            </span>
          </p>

          <p>
            Abertura:{" "}
            <span className="font-semibold">
              {new Date(chamado.data_abertura).toLocaleDateString()}
            </span>
          </p>

          <p>
            Tempo decorrido:{" "}
            <span className="text-yellow-500 dark:text-yellow-400">
              <Timer dataAbertura={chamado.data_abertura} />
            </span>
          </p>
        </div>
      </HoverCardContent>
    </div>
  );
}
