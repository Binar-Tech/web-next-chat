import { Button } from "@/app/_components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/app/_components/ui/dropdown-menu";
import { FaLink, FaPhone } from "react-icons/fa";
import { ChamadosDto } from "../_actions/dtos/chamado.dto";
import { dropdownEventEmitter } from "../_services/dropdown-event/dropdown-event-emitter";

interface ChatSidebarProps {
  chat?: ChamadosDto;
  idTecnico: string;
  isAdmin?: boolean;
}

export default function ChatSidebar({
  isAdmin = false,
  idTecnico,
  chat,
}: ChatSidebarProps) {
  const verifyEnableButton = (): boolean => {
    if (chat !== undefined && chat?.tecnico_responsavel !== null) {
      return false;
    }
    return true;
  };
  return (
    <div className="flex flex-row justify-between bg-white items-center">
      <div className="flex flex-1 justify-start flex-col m-1">
        {chat !== undefined && (
          <>
            <div className="flex flex-row items-center gap-2">
              <FaLink size={12} className="gap-2" />

              <a
                href={`https://${chat?.link_operador}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 "
              >
                {chat?.link_operador}
              </a>
            </div>
            <div className="flex flex-row items-center gap-2">
              <FaPhone size={12} className="gap-2" />
              <div className="">{chat?.contato}</div>
            </div>
          </>
        )}
      </div>
      <div className="flex flex-1 flex-row justify-end ">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              className="m-1 bg-blue-400 text-white hover:bg-orange-400 hover:text-white"
              disabled={verifyEnableButton()}
            >
              Opções
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56">
            <DropdownMenuGroup>
              {(chat?.tecnico_responsavel !== idTecnico || isAdmin) && (
                <>
                  <DropdownMenuItem
                    onClick={() =>
                      dropdownEventEmitter.emit("dropdownOpcoesClick", "entrar")
                    }
                  >
                    Entrar na conversa
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() =>
                      dropdownEventEmitter.emit("dropdownOpcoesClick", "sair")
                    }
                  >
                    Sair da conversa
                  </DropdownMenuItem>
                </>
              )}
              {(chat?.tecnico_responsavel === idTecnico || isAdmin) && (
                <>
                  <DropdownMenuItem
                    onClick={() =>
                      dropdownEventEmitter.emit(
                        "dropdownOpcoesClick",
                        "encerrar"
                      )
                    }
                  >
                    Encerrar atendimento
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() =>
                      dropdownEventEmitter.emit(
                        "dropdownOpcoesClick",
                        "encerrarOffTicket"
                      )
                    }
                  >
                    Encerra atendimento sem ticket
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
