import { ChamadosDto } from "../../home/_actions/api";
import ChatItem from "./chat-item";

interface ChatListProps {
  chatList: ChamadosDto[];
  selectedChatId: number | null;
  onSelect: (chatId: number) => void;
}

export default function ChatList({
  chatList,
  selectedChatId,
  onSelect,
}: ChatListProps) {
  return (
    <div className="border-r border-gray-200 w-full h-screen overflow-y-auto">
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-xl font-semibold">Chats</h2>
        <input
          type="text"
          placeholder="Search..."
          className="w-full mt-4 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div>
        {chatList.map((call) => (
          <ChatItem
            key={call.id_chamado}
            chamado={call}
            unreadCount={2}
            isSelected={call.id_chamado === selectedChatId}
            onSelect={() => onSelect(call.id_chamado)}
          />
        ))}
      </div>
    </div>
  );
}
