import { LucideCircleArrowDown } from "lucide-react";

interface NewMessageButtonProps {
  onClick: () => void;
  text: string;
}

const NewMessageButton: React.FC<NewMessageButtonProps> = ({
  onClick,
  text,
}) => {
  return (
    <button
      onClick={onClick}
      className="flex gap-2 flex-row items-center fixed bottom-20 left-[50%] bg-black opacity-25 text-sm text-white px-4 py-2 rounded-2xl shadow-lg"
    >
      <LucideCircleArrowDown />
      {text}
    </button>
  );
};

export default NewMessageButton;
