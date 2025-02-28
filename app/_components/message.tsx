interface MessageProps {
  text: string;
  isCurrentUser: boolean;
}

export default function Message({ text, isCurrentUser }: MessageProps) {
  return (
    <div
      className={`flex ${isCurrentUser ? "justify-end" : "justify-start"} mb-4`}
    >
      <div
        className={`max-w-xs p-3 rounded-lg ${
          isCurrentUser ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-800"
        }`}
      >
        <p>{text}</p>
      </div>
    </div>
  );
}
