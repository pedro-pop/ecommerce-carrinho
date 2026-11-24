import { ref } from 'vue'

const toasts = ref([])
let nextId = 1

export function useToast() {
  function showToast(message, type = 'success') {
    const id = nextId++
    toasts.value.push({ id, message, type })
    setTimeout(() => dismissToast(id), 3000)
  }

  function dismissToast(id) {
    toasts.value = toasts.value.filter((toast) => toast.id !== id)
  }

  return { toasts, showToast, dismissToast }
}
