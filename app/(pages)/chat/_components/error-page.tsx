import { Button } from "@/app/components/ui/button";
import { FileWarning } from "lucide-react";

interface ErrorPageProps {
  message: string;
}

export default function ErrorPage({ message }: ErrorPageProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-dark-green-500 dark:text-white dark:bg-neutral-700 px-4">
      <FileWarning className="w-20 h-20 text-red-500" />
      <h1 className="text-2xl font-bold mt-4">{message}</h1>
      <Button
        className="mt-2 dark:text-white dark:bg-neutral-500"
        onClick={() => window.location.reload()}
      >
        Recarregar
      </Button>
    </div>
  );
}
