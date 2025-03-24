interface NewDateSeparadotProps {
  messageDate: string;
}

export default function NewDateSeparator({
  messageDate,
}: NewDateSeparadotProps) {
  return (
    <div className="flex justify-center my-4">
      <div className="bg-gray-200 text-gray-800 px-3 py-1 rounded-lg text-sm">
        {messageDate}
      </div>
    </div>
  );
}
