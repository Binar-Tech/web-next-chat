import { MessageDto } from "../(pages)/chat/_actions/dtos/message-dto";

interface MessageProps {
  message: MessageDto;
  isCurrentUser: boolean;
}

export default function Message({ message, isCurrentUser }: MessageProps) {
  return (
    <div
      className={`flex ${isCurrentUser ? "justify-end" : "justify-start"} mb-4`}
    >
      <div
        className={`max-w-xs p-3 rounded-lg ${
          isCurrentUser ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-800"
        }`}
      >
        <p>{message.mensagem}</p>
      </div>
    </div>
  );
}
