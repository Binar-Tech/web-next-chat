import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/app/components/ui/dropdown-menu";
import { Edit, EllipsisVerticalIcon, Reply, Trash } from "lucide-react";

export type MessageAction = "reply" | "delete" | "edit";

interface MessageReplyActionsProps {
  hideButtonEdit: boolean;
  onClick: (action: MessageAction) => void;
}

export default function MessageReplyActions({
  hideButtonEdit = false,
  onClick,
}: MessageReplyActionsProps) {
  return (
    <div className="p-1 flex items-center justify-center ">
      <DropdownMenu>
        <DropdownMenuTrigger className="border-none outline-none ring-0 focus:outline-none focus:ring-0">
          <EllipsisVerticalIcon size={16} />
        </DropdownMenuTrigger>
        <DropdownMenuContent className="">
          <DropdownMenuItem onClick={() => onClick("delete")}>
            <Reply size={14} />
            <div>Responder</div>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onClick("delete")}>
            <Trash size={14} />
            <div>Apagar</div>
          </DropdownMenuItem>
          {!hideButtonEdit && (
            <DropdownMenuItem onClick={() => onClick("edit")}>
              <Edit size={14} />
              <div>Editar</div>
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
