import { defineStore } from "pinia";
import { ref } from "vue";

export type ToastType = "info" | "warning";

export interface ToastMessage {
  id: number;
  message: string;
  type: ToastType;
  timeoutId?: number;
}

export const useToastStore = defineStore("toast", () => {
  const toasts = ref<ToastMessage[]>([]);
  let nextId = 0;

  const showToast = (
    message: string,
    type: ToastType = "info",
    duration: number = 1000
  ) => {
    const id = nextId++;
    const newToast: ToastMessage = { id, message, type };
    toasts.value.push(newToast);

    // Auto-hide after duration
    newToast.timeoutId = window.setTimeout(() => {
      removeToast(id);
    }, duration);
  };

  const removeToast = (id: number) => {
    const index = toasts.value.findIndex((toast) => toast.id === id);
    if (index !== -1) {
      if (toasts.value[index].timeoutId) {
        clearTimeout(toasts.value[index].timeoutId);
      }
      toasts.value.splice(index, 1);
    }
  };

  return {
    toasts,
    showToast,
    removeToast,
  };
});
