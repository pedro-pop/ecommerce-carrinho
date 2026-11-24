<script setup>
import { formatarPreco } from '../../services/productService'

defineProps({
  totalItems: { type: Number, required: true },
  subtotal: { type: Number, required: true },
  shipping: { type: Number, required: true },
  total: { type: Number, required: true },
})
</script>

<template>
  <aside class="summary-box">
    <h2 class="h5 fw-semibold mb-4">Resumo do pedido</h2>
    <div class="d-flex justify-content-between mb-2">
      <span class="text-secondary">Itens</span><span>{{ totalItems }}</span>
    </div>
    <div class="d-flex justify-content-between mb-2">
      <span class="text-secondary">Subtotal</span><span>{{ formatarPreco(subtotal) }}</span>
    </div>
    <div class="d-flex justify-content-between mb-3">
      <span class="text-secondary">Frete (demonstrativo)</span>
      <span>{{ shipping === 0 ? 'Grátis' : formatarPreco(shipping) }}</span>
    </div>
    <hr />
    <div class="d-flex justify-content-between fs-5 fw-bold mb-4">
      <span>Total</span><span>{{ formatarPreco(total) }}</span>
    </div>
    <slot />
  </aside>
</template>
