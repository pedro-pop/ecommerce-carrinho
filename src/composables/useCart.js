import { ref, computed, watch } from 'vue'

const STORAGE_KEY = 'noir-cart'
const MAX_POR_ITEM = 10
const FRETE_FIXO = 29.9
const FRETE_GRATIS_ACIMA_DE = 500

function loadCart() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY))
    return Array.isArray(saved) ? saved : []
  } catch {
    return []
  }
}

// Estado único do carrinho, compartilhado por todos os componentes.
const items = ref(loadCart())

// Sempre que o carrinho muda, grava no localStorage.
watch(items, (value) => localStorage.setItem(STORAGE_KEY, JSON.stringify(value)), { deep: true })

const totalItems = computed(() => items.value.reduce((sum, item) => sum + item.quantity, 0))
const subtotal = computed(() =>
  items.value.reduce((sum, item) => sum + item.price * item.quantity, 0),
)
const shipping = computed(() => {
  if (items.value.length === 0 || subtotal.value >= FRETE_GRATIS_ACIMA_DE) return 0
  return FRETE_FIXO
})
const total = computed(() => subtotal.value + shipping.value)

const limitar = (quantity) => Math.min(MAX_POR_ITEM, Math.max(1, quantity))

export function useCart() {
  function addItem(product, quantity = 1) {
    const existing = items.value.find((item) => item.id === product.id)
    if (existing) {
      existing.quantity = limitar(existing.quantity + quantity)
      return
    }
    // Guardamos só o necessário do produto (uma "foto" dele no momento da compra).
    items.value.push({
      id: product.id,
      title: product.title,
      price: product.price,
      category: product.category,
      image: product.images?.[0] || product.thumbnail || '',
      quantity: limitar(quantity),
    })
  }

  function setQuantity(id, quantity) {
    const item = items.value.find((entry) => entry.id === id)
    if (item) item.quantity = limitar(quantity)
  }

  function removeItem(id) {
    items.value = items.value.filter((item) => item.id !== id)
  }

  function clear() {
    items.value = []
  }

  return {
    items, totalItems, subtotal, shipping, total,
    addItem, setQuantity, removeItem, clear,
    MAX_POR_ITEM, FRETE_GRATIS_ACIMA_DE,
  }
}
