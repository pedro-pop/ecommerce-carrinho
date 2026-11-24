<script setup>
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useOrders } from '../composables/useOrders'
import { formatarPreco } from '../services/productService'
import AppIcon from '../components/common/AppIcon.vue'

const router = useRouter()
const { lastOrder } = useOrders()

// Quem abrir esta URL sem ter feito um pedido volta para a loja.
onMounted(() => {
  if (!lastOrder.value) router.replace('/')
})
</script>

<template>
  <div v-if="lastOrder" class="container py-5" style="max-width: 720px">
    <div class="success-icon"><AppIcon name="check" :size="28" /></div>
    <h1 class="page-title text-center">Pedido confirmado</h1>
    <p class="text-center text-secondary">
      Obrigado, {{ lastOrder.buyer.nome.split(' ')[0] }}. Este é um pedido demonstrativo.
    </p>
    <p class="text-center"><strong>Nº {{ lastOrder.number }}</strong> · {{ lastOrder.date }}</p>

    <div class="summary-box my-4">
      <div v-for="item in lastOrder.items" :key="item.id" class="d-flex justify-content-between py-2 border-bottom">
        <span>{{ item.quantity }}x {{ item.title }}</span>
        <span>{{ formatarPreco(item.price * item.quantity) }}</span>
      </div>
      <div class="d-flex justify-content-between pt-3"><span class="text-secondary">Subtotal</span><span>{{ formatarPreco(lastOrder.subtotal) }}</span></div>
      <div class="d-flex justify-content-between"><span class="text-secondary">Frete</span><span>{{ lastOrder.shipping === 0 ? 'Grátis' : formatarPreco(lastOrder.shipping) }}</span></div>
      <div class="d-flex justify-content-between fw-bold fs-5 mt-2"><span>Total</span><span>{{ formatarPreco(lastOrder.total) }}</span></div>
      <p class="small text-secondary mt-3 mb-0">
        Entrega em {{ lastOrder.buyer.endereco }}, {{ lastOrder.buyer.numero }} — {{ lastOrder.buyer.cidade }}/{{ lastOrder.buyer.estado.toUpperCase() }}
      </p>
    </div>

    <div class="text-center">
      <router-link to="/" class="btn btn-dark rounded-0 px-5 py-3">Voltar à loja</router-link>
    </div>
  </div>
</template>
