interface Props {
  text: string;
  isReply: boolean;
  isCurrentUser: boolean;
}

export default function MessageText({ text, isReply, isCurrentUser }: Props) {
  return (
    <p
      className={`${isReply ? "text-xs" : "text-sm"} ${
        isCurrentUser ? "text-muted" : ""
      } dark:text-foreground`}
    >
      {text}
    </p>
  );
}
