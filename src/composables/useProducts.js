import { ref } from 'vue'
import { fetchProducts, getFallbackProducts } from '../services/productService'

// Estado no escopo do módulo: todas as telas compartilham a mesma lista de produtos.
const products = ref([])
const loading = ref(false)
const error = ref('')
const usingFallback = ref(false)
let loaded = false

// Na pré-visualização (sandbox sem acesso à internet) a API nem é chamada.
const previewMode = import.meta.env.VITE_PREVIEW === 'true'

export function useProducts() {
  async function loadProducts() {
    if (loaded || loading.value) return
    if (previewMode) {
      products.value = getFallbackProducts()
      usingFallback.value = true
      loaded = true
      return
    }
    loading.value = true
    error.value = ''
    try {
      products.value = await fetchProducts()
      usingFallback.value = false
      loaded = true
    } catch (e) {
      // Falhou: mostramos o aviso e usamos os dados locais de reserva.
      error.value = e.message
      products.value = getFallbackProducts()
      usingFallback.value = true
    } finally {
      loading.value = false
    }
  }

  function reloadProducts() {
    loaded = false
    return loadProducts()
  }

  const findById = (id) => products.value.find((item) => item.id === Number(id))

  return { products, loading, error, usingFallback, previewMode, loadProducts, reloadProducts, findById }
}
