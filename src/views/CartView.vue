<script setup>
import { useCart } from '../composables/useCart'
import { useToast } from '../composables/useToast'
import CartItem from '../components/cart/CartItem.vue'
import CartSummary from '../components/cart/CartSummary.vue'
import EmptyState from '../components/common/EmptyState.vue'

const { items, totalItems, subtotal, shipping, total, setQuantity, removeItem, MAX_POR_ITEM } = useCart()
const { showToast } = useToast()

function increase(id) {
  const item = items.value.find((entry) => entry.id === id)
  setQuantity(id, item.quantity + 1)
}

function decrease(id) {
  const item = items.value.find((entry) => entry.id === id)
  setQuantity(id, item.quantity - 1)
}

function remove(id) {
  removeItem(id)
  showToast('Produto removido do carrinho.')
}
</script>

<template>
  <div class="container py-5">
    <h1 class="page-title">Carrinho</h1>

    <EmptyState v-if="items.length === 0" title="Seu carrinho está vazio"
                message="Adicione produtos para ver o resumo do pedido aqui.">
      <router-link to="/produtos" class="btn btn-dark rounded-0 px-4">Continuar comprando</router-link>
    </EmptyState>

    <div v-else class="row g-5">
      <div class="col-lg-8">
        <CartItem v-for="item in items" :key="item.id" :item="item" :max="MAX_POR_ITEM"
                  @increase="increase" @decrease="decrease" @remove="remove" />
        <router-link to="/produtos" class="btn btn-outline-dark rounded-0 mt-4">Continuar comprando</router-link>
      </div>
      <div class="col-lg-4">
        <CartSummary :total-items="totalItems" :subtotal="subtotal" :shipping="shipping" :total="total">
          <router-link to="/checkout" class="btn btn-dark rounded-0 w-100 py-3 fw-semibold">
            Finalizar pedido
          </router-link>
        </CartSummary>
      </div>
    </div>
  </div>
</template>
