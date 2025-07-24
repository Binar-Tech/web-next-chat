import { HoverCard, HoverCardTrigger } from "@radix-ui/react-hover-card";
import clsx from "clsx";
import { LucideGlobe, LucideLink, LucidePhone, LucideUser } from "lucide-react";
import { ChamadosDto } from "../../chat/_actions/dtos/chamado.dto";
import { ChatItemHoverContentCard } from "../../chat/_components/hover-content-card";

interface ChatItemProps {
  chamado: ChamadosDto;
}

export default function ChatItem({ chamado }: ChatItemProps) {
  const isCritical = chamado.status === "ABERTO"; // você pode mudar esse critério

  return (
    <HoverCard openDelay={700}>
      <HoverCardTrigger className="h-full">
        <div
          className={clsx(
            "h-full flex flex-col justify-between p-4 rounded-md shadow-md cursor-pointer transition-all duration-400 bg-red-500/40 border border-red-500 animate-blink",
            isCritical
              ? "bg-red-500/30 border border-red-500 animate-blink"
              : "bg-muted hover:bg-accent"
          )}
        >
          <div className="flex flex-col gap-1 flex-1">
            <span className="font-semibold text-blue-600 dark:text-blue-400 md:text-lg">
              {chamado.nome_operador}
            </span>

            {chamado.tecnico?.name && (
              <div className="flex items-center gap-1 text-sm md:text-xl ">
                <span className="font-medium ">Técnico:</span>
                <span>{chamado.tecnico.name}</span>
              </div>
            )}

            <div className="flex items-center gap-1 text-sm md:text-lg ">
              <LucideGlobe
                size={20}
                className="text-gray-500 dark:text-gray-200"
              />
              <span className="font-medium dark:text-orange-200">Empresa:</span>
              <span>{chamado.empresa.fantasia}</span>
            </div>

            <div className="flex items-center gap-1 text-sm md:text-lg ">
              <LucideUser
                size={20}
                className="text-gray-500 dark:text-gray-200"
              />
              <span className="font-medium dark:text-orange-200">CNPJ:</span>
              <span>{chamado.cnpj_operador}</span>
            </div>

            <div className="flex items-center gap-1 text-sm md:text-lg ">
              <LucidePhone
                size={20}
                className="text-gray-500 dark:text-gray-200"
              />
              <span className="font-medium dark:text-orange-200">Contato:</span>
              <span>{chamado.contato}</span>
            </div>

            <div className="flex items-center gap-1 text-sm md:text-lg ">
              <LucideLink
                size={20}
                className="text-gray-500 dark:text-gray-200"
              />
              <span className="font-medium dark:text-orange-200">Link:</span>
              <span>{chamado.link_operador}</span>
            </div>
          </div>
        </div>
      </HoverCardTrigger>

      <ChatItemHoverContentCard chamado={chamado} />
    </HoverCard>
  );
}
