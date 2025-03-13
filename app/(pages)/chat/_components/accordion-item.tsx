import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/app/_components/ui/accordion";
import ChatItem from "./chat-item";

interface ChatAccordionSectionProps {
  title: string;
  value: string;
  chats: any[]; // Tipar corretamente se houver uma interface específica
  selectedChatId: number | null;
  onSelect: (chatId: number) => void;
}

export default function ChatAccordionSection({
  title,
  value,
  chats,
  selectedChatId,
  onSelect,
}: ChatAccordionSectionProps) {
  return (
    <AccordionItem
      value={value}
      className="border-none rounded-lg shadow-md bg-white dark:bg-gray-800 mb-2"
    >
      <AccordionTrigger className="px-4 py-3 text-blue-400 text-lg font-semibold bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-all">
        {title}
      </AccordionTrigger>
      <AccordionContent className="p-2 bg-gray-50 dark:bg-gray-900 rounded-b-lg">
        {chats.map((call, index) => (
          <div
            key={call.id_chamado}
            className={`pb-2 pt-2 ${
              index !== chats.length - 1
                ? "border-b border-gray-300 dark:border-gray-700"
                : ""
            }`}
          >
            <ChatItem
              key={call.id_chamado}
              chamado={call}
              unreadCount={call.unread_messages}
              isSelected={call.id_chamado === selectedChatId}
              onSelect={() => onSelect(call.id_chamado)}
            />
          </div>
        ))}
      </AccordionContent>
    </AccordionItem>
  );
}
