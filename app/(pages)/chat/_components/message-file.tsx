import { LucideDownload } from "lucide-react";

interface Props {
  src: string;
  filename: string;
}

export default function MessageFile({ src, filename }: Props) {
  return (
    <a
      href={src}
      download={filename}
      rel="noopener noreferrer"
      className="mt-2 bg-blue-700 text-white px-3 py-2 rounded-lg text-sm flex flex-row items-center gap-2"
    >
      <LucideDownload size={18} />
      {filename}
    </a>
  );
}
