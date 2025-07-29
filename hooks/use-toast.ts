import { useCallback } from "react";

interface ToastOptions {
  message: string;
  type?: "success" | "error" | "info";
  duration?: number;
}

export function useToast() {
  const showToast = useCallback((options: ToastOptions) => {
    // Basic implementation: replace with your own UI logic
    alert(`${options.type ? `[${options.type}] ` : ""}${options.message}`);
    // You can integrate with a toast library here
  }, []);

  return { showToast };
}
