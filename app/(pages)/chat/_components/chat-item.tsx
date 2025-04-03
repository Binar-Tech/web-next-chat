import { Button } from "@/app/components/ui/button";
import { HoverCard, HoverCardTrigger } from "@radix-ui/react-hover-card";
import { ChamadosDto } from "../_actions/dtos/chamado.dto";
import { ChatItemHoverContentCard } from "./hover-content-card";

interface ChatItemProps {
  chamado: ChamadosDto;
  unreadCount: number;
  isSelected: boolean;
  onSelect: (chatId: number) => void;
  onAcceptCall: (chatId: number) => void;
}

export default function ChatItem({
  chamado,
  unreadCount,
  isSelected,
  onSelect,
  onAcceptCall,
}: ChatItemProps) {
  return (
    <HoverCard openDelay={1000}>
      <HoverCardTrigger>
        <div
          onClick={() => onSelect(chamado.id_chamado)}
          className={`flex items-center py-2 px-2 cursor-pointer rounded-sm transition-all duration-650 ${
            isSelected
              ? "bg-[#e3e3fd] dark:bg-gray-700"
              : chamado.tecnico_responsavel != null
              ? "hover:bg-blue-300 dark:hover:bg-slate-700"
              : "hover:bg-blue-300 bg-red-400 animate-pulse"
          }`}
        >
          <div className="flex-1 flex flex-col items-start gap-1">
            <h2>
              <p
                className={`font-bold text-sm ${
                  chamado.tecnico_responsavel === null
                    ? "text-white"
                    : "text-gray-900 dark:text-gray-100"
                }`}
              >
                {chamado.nome_operador}
              </p>
            </h2>
            <div
              className={`text-xs gap-2 ${
                chamado.tecnico_responsavel === null
                  ? "text-white"
                  : "text-gray-500"
              }`}
            >
              {chamado.tecnico?.name != null && (
                <div className="flex flex-row pb-1 items-center gap-1">
                  <p
                    className={`text-gray-400 dark:text-gray-300 ${
                      chamado.tecnico_responsavel === null ? "text-white" : ""
                    }`}
                  >
                    Técnico:
                  </p>
                  <p
                    className={`font-semibold ${
                      chamado.tecnico_responsavel === null
                        ? "text-white"
                        : "text-gray-500 dark:text-gray-200"
                    }`}
                  >
                    {chamado.tecnico?.name ?? ""}
                  </p>
                </div>
              )}
              <div className="flex flex-row pb-1 items-center gap-1">
                <p
                  className={`text-gray-400 dark:text-gray-300 ${
                    chamado.tecnico_responsavel === null ? "text-white" : ""
                  }`}
                >
                  Empresa:
                </p>
                <p
                  className={`${
                    chamado.tecnico_responsavel === null
                      ? "text-white"
                      : "text-gray-500 dark:text-gray-200"
                  }`}
                >
                  {chamado.empresa.fantasia}
                </p>
              </div>
              <div className="flex flex-row items-center gap-1">
                <p
                  className={`text-gray-400 dark:text-gray-300 ${
                    chamado.tecnico_responsavel === null ? "text-white" : ""
                  }`}
                >
                  CNPJ:
                </p>
                <p
                  className={`${
                    chamado.tecnico_responsavel === null
                      ? "text-white"
                      : "text-gray-500 dark:text-gray-200"
                  }`}
                >
                  {chamado.cnpj_operador}
                </p>
              </div>
            </div>
            {chamado.tecnico_responsavel === null && (
              <Button
                className="bg-blue-400 h-8 self-end hover:bg-orange-400"
                onClick={() => onAcceptCall(chamado.id_chamado)}
              >
                Atender
              </Button>
            )}
          </div>

          {unreadCount > 0 && (
            <div className="ml-4 bg-blue-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center">
              {unreadCount}
            </div>
          )}
        </div>
      </HoverCardTrigger>
      <ChatItemHoverContentCard chamado={chamado} />
    </HoverCard>
  );
}
