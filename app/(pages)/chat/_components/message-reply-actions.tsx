import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/app/components/ui/dropdown-menu";
import { useState } from "react";

import { Edit, EllipsisVerticalIcon, Reply, Trash } from "lucide-react";
import ConfirmDialog from "./confirm-dialog";

export type MessageAction = "reply" | "delete" | "edit";

interface MessageReplyActionsProps {
  isCurrentUser: boolean;
  hideButtonEdit?: boolean;
  onClick: (action: MessageAction) => void;
}

export default function MessageReplyActions({
  isCurrentUser,
  onClick,
  hideButtonEdit = false,
}: MessageReplyActionsProps) {
  const [openConfirm, setOpenConfirm] = useState(false);

  // Função para abrir modal garantindo que dropdown feche primeiro
  const handleOpenConfirm = () => {
    setTimeout(() => setOpenConfirm(true), 0);
  };

  return (
    <div className="p-1 flex items-center justify-center">
      <DropdownMenu>
        <DropdownMenuTrigger>
          <EllipsisVerticalIcon size={16} />
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem onClick={() => onClick("reply")}>
            <Reply size={14} /> <div>Responder</div>
          </DropdownMenuItem>

          {!hideButtonEdit && isCurrentUser && (
            <DropdownMenuItem onClick={() => onClick("edit")}>
              <Edit size={14} /> <div>Editar</div>
            </DropdownMenuItem>
          )}
          {isCurrentUser && (
            <DropdownMenuItem onClick={handleOpenConfirm}>
              <Trash size={14} /> <div>Apagar</div>
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      <ConfirmDialog
        open={openConfirm}
        onOpenChange={setOpenConfirm}
        title="Confirmar exclusão"
        description="Tem certeza que deseja apagar esta mensagem? Essa ação não pode ser desfeita."
        confirmText="Apagar"
        cancelText="Cancelar"
        onConfirm={() => onClick("delete")}
      />
    </div>
  );
}
