import { Button } from "@/app/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/app/components/ui/dropdown-menu";

import { LucideUser, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
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
  const { setTheme } = useTheme();
  const verifyEnableButton = (): boolean => {
    if (chat !== undefined && chat?.tecnico_responsavel !== null) {
      return false;
    }
    return true;
  };
  return (
    <div className="flex flex-row justify-between bg-white items-center dark:bg-neutral-700">
      <div className="flex flex-1 justify-start flex-col m-1">
        {chat !== undefined && (
          <>
            <div className="flex flex-row items-center gap-2">
              <LucideUser size={18} className="gap-2" />
              <div className="text-sm">{chat?.nome_operador}</div>
            </div>
          </>
        )}
      </div>
      <div className="flex flex-1 flex-row justify-end items-center">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon">
              <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
              <span className="sr-only">Toggle theme</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => setTheme("light")}>
              Light
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setTheme("dark")}>
              Dark
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setTheme("system")}>
              System
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
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
              {(chat?.tecnico_responsavel !== idTecnico ||
                (isAdmin && chat?.tecnico_responsavel !== idTecnico)) && (
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
