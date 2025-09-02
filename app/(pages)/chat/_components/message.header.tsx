interface Props {
  name: string;
  date: string;
  isReply: boolean;
  isCurrentUser: boolean;
}

export default function MessageHeader({
  name,
  date,
  isReply,
  isCurrentUser,
}: Props) {
  return (
    <div className="flex w-full justify-between items-center mb-2">
      <div
        className={`${isReply ? "text-[11px]" : "text-xs"} pr-4 ${
          isCurrentUser
            ? "text-muted dark:text-foreground font-semibold font-serif"
            : "text-orange-400 dark:text-orange-400 font-extrabold font-serif"
        }`}
      >
        {name}
      </div>
      <div
        className={`text-[.7rem] ${
          isCurrentUser
            ? "text-muted dark:text-foreground"
            : "text-muted-foreground dark:text-gray-300"
        }`}
      >
        {date}
      </div>
    </div>
  );
}
