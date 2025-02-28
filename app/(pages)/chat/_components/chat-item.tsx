import { ChamadosDto } from "../../home/_actions/api";

interface ChatItemProps {
  chamado: ChamadosDto;
  unreadCount: number;
  isSelected: boolean;
  onSelect: (chatId: number) => void;
}

export default function ChatItem({
  chamado,
  unreadCount,
  isSelected,
  onSelect,
}: ChatItemProps) {
  return (
    <div
      onClick={() => onSelect(chamado.id_chamado)}
      className={`flex items-center p-4 cursor-pointer ${
        isSelected ? "bg-blue-300" : "hover:bg-gray-50"
      }`}
    >
      <div className="flex-1">
        <h3 className="font-semibold">{chamado.nome_operador}</h3>
        <p className="text-sm text-gray-500">"ultima mensagem"</p>
      </div>

      {unreadCount > 0 && (
        <div className="ml-4 bg-blue-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center">
          {unreadCount}
        </div>
      )}
    </div>
  );
}
