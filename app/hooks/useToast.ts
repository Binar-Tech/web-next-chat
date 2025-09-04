import { toast } from "sonner";

export function useNotify() {
  return {
    successToast: (message: string) =>
      toast.success(message, {
        duration: 3000,
      }),
    errorToast: (message: string) =>
      toast.error(message, {
        duration: 4000,
      }),
    infoToast: (message: string) =>
      toast(message, {
        duration: 3000,
      }),
  };
}
