import { ChamadosDto } from "../../home/_actions/api";
import ChatItem from "./chat-item";

const mockChats = [
  {
    id: 1,
    name: "Jacquenetta Slowgrave",
    lastMessage: "Great! Looking forward to...",
    time: "10 minutes",
    unreadCount: 8,
  },
  {
    id: 2,
    name: "Nickola Peever",
    lastMessage: "Sounds perfect! I've been...",
    time: "40 minutes",
    unreadCount: 2,
  },
  {
    id: 3,
    name: "Farand Hume",
    lastMessage: "How about 7 PM at the new Ita...",
    time: "Yesterday",
    unreadCount: 0,
  },
  {
    id: 4,
    name: "Ossie Peasey",
    lastMessage: "Hey Bonnie, yes, definitely! W...",
    time: "13 days",
    unreadCount: 0,
  },
  {
    id: 5,
    name: "Hall Negri",
    lastMessage: "No worries at all! I'll grab a tab...",
    time: "2 days",
    unreadCount: 0,
  },
  {
    id: 6,
    name: "Elyssa Segot",
    lastMessage: "She just told me today.",
    time: "Yesterday",
    unreadCount: 0,
  },
  {
    id: 7,
    name: "Gil Wilfing",
    lastMessage: "See you in 5 minutes!",
    time: "1 day",
    unreadCount: 0,
  },
  {
    id: 8,
    name: "Bab Cleaton",
    lastMessage: "If it takes long you can mail",
    time: "3 hours",
    unreadCount: 0,
  },
  {
    id: 9,
    name: "Janith Satch",
    lastMessage: "Absolutely! It's amazing to...",
    time: "1 day",
    unreadCount: 0,
  },
];

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
