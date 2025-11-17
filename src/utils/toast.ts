import { ref } from "vue";

export const toast = ref({
  show: false,
  text: "",
  type: "success" as "success" | "error" | 'notification',
});

export function showToast(message: string, type: "success" | "error" | 'notification') {
  toast.value = { show: true, text: message, type };
  setTimeout(() => {
    toast.value.show = false;
  }, 2000);
}