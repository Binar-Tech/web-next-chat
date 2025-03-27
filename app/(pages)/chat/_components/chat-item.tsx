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
          className={`flex items-center py-2 px-2 cursor-pointer rounded-sm ${
            isSelected
              ? "bg-[#e3e3fd] dark:bg-gray-700"
              : "hover:bg-blue-300 dark:hover:bg-slate-700"
          }`}
        >
          <div className="flex-1 flex flex-col items-start gap-1">
            <h2>
              <p className="font-bold text-sm">{chamado.nome_operador}</p>
            </h2>
            <div className="text-xs gap-2">
              <div className="flex flex-row pb-1 items-center gap-1">
                <p className=" text-gray-400 dark:text-gray-300">Ténico: </p>
                <p className=" text-gray-500 font-semibold dark:text-gray-200">
                  {chamado.tecnico?.name ?? ""}
                </p>
              </div>
              <div className="flex flex-row pb-1 items-center gap-1">
                <p className=" text-gray-400 dark:text-gray-300">Empresa: </p>
                <p className=" text-gray-500 dark:text-gray-200">
                  {chamado.empresa.fantasia}
                </p>
              </div>
              <div className="flex flex-row items-center gap-1">
                <p className=" text-gray-400 dark:text-gray-300">CNPJ: </p>
                <p className=" text-gray-500 dark:text-gray-200">
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
