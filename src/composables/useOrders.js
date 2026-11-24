import { ref } from 'vue'

const STORAGE_KEY = 'noir-last-order'

function loadOrder() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || null
  } catch {
    return null
  }
}

const lastOrder = ref(loadOrder())

export function useOrders() {
  // Pedido demonstrativo: não existe back-end, ele só fica guardado no navegador.
  function createOrder({ buyer, items, subtotal, shipping, total }) {
    const order = {
      number: `NOIR-${Date.now().toString().slice(-8)}`,
      date: new Date().toLocaleString('pt-BR'),
      buyer,
      items: items.map((item) => ({ ...item })),
      subtotal,
      shipping,
      total,
    }
    lastOrder.value = order
    localStorage.setItem(STORAGE_KEY, JSON.stringify(order))
    return order
  }

  return { lastOrder, createOrder }
}
