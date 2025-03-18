import { Button } from "@/app/_components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/app/_components/ui/dropdown-menu";
import { ChamadosDto } from "../_actions/dtos/chamado.dto";

interface ChatSidebarProps {
  chat?: ChamadosDto;
}

export default function ChatSidebar({ chat }: ChatSidebarProps) {
  const verifyEnableButton = (): boolean => {
    console.log("chat ", chat);
    if (chat?.tecnico_responsavel !== null) {
      return false;
    }
    return true;
  };
  return (
    <div className="flex flex-row justify-between bg-white items-center">
      <div className="flex flex-1 justify-start">1</div>
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
              <DropdownMenuItem>Profile</DropdownMenuItem>
              <DropdownMenuItem>Billing</DropdownMenuItem>
              <DropdownMenuItem>Settings</DropdownMenuItem>
              <DropdownMenuItem>Keyboard shortcuts</DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
