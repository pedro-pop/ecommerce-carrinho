<script setup>
import { reactive, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useCart } from '../composables/useCart'
import { useOrders } from '../composables/useOrders'
import { formatarPreco } from '../services/productService'
import CartSummary from '../components/cart/CartSummary.vue'
import BaseButton from '../components/common/BaseButton.vue'

const router = useRouter()
const { items, totalItems, subtotal, shipping, total, clear } = useCart()
const { createOrder } = useOrders()

const form = reactive({
  nome: '', email: '', telefone: '',
  cep: '', endereco: '', numero: '', cidade: '', estado: '',
})
const errors = ref({})
const orderPlaced = ref(false)

// Sem itens não há o que finalizar: volta para o carrinho (exceto logo após confirmar o pedido).
watch(
  items,
  (value) => value.length === 0 && !orderPlaced.value && router.replace('/carrinho'),
  { immediate: true },
)

const apenasDigitos = (texto) => texto.replace(/\D/g, '')

function validate() {
  const e = {}
  if (form.nome.trim().length < 3) e.nome = 'Informe seu nome completo.'
  if (!/^\S+@\S+\.\S+$/.test(form.email)) e.email = 'Informe um e-mail válido.'
  if (apenasDigitos(form.telefone).length < 10) e.telefone = 'Informe DDD e telefone.'
  if (apenasDigitos(form.cep).length !== 8) e.cep = 'O CEP deve ter 8 dígitos.'
  if (form.endereco.trim().length < 3) e.endereco = 'Informe o endereço.'
  if (!form.numero.trim()) e.numero = 'Informe o número.'
  if (form.cidade.trim().length < 2) e.cidade = 'Informe a cidade.'
  if (!/^[A-Za-z]{2}$/.test(form.estado)) e.estado = 'Use a sigla (ex.: PA).'
  errors.value = e
  return Object.keys(e).length === 0
}

function confirmOrder() {
  if (!validate()) return
  createOrder({
    buyer: { ...form },
    items: items.value,
    subtotal: subtotal.value,
    shipping: shipping.value,
    total: total.value,
  })
  orderPlaced.value = true
  clear()
  router.push({ name: 'order-success' })
}
</script>

<template>
  <div class="container py-5">
    <h1 class="page-title">Finalizar pedido</h1>
    <p class="text-secondary">Checkout demonstrativo: nenhum pagamento é processado e nenhum dado bancário é solicitado.</p>

    <div class="row g-5">
      <form class="col-lg-7" novalidate @submit.prevent="confirmOrder">
        <h2 class="h5 fw-semibold mb-3">Identificação</h2>
        <div class="row g-3 mb-4">
          <div class="col-12">
            <label class="form-label" for="c-nome">Nome completo</label>
            <input id="c-nome" v-model="form.nome" class="form-control" :class="{ 'is-invalid': errors.nome }" />
            <div class="invalid-feedback">{{ errors.nome }}</div>
          </div>
          <div class="col-md-7">
            <label class="form-label" for="c-email">E-mail</label>
            <input id="c-email" v-model="form.email" type="email" class="form-control" :class="{ 'is-invalid': errors.email }" />
            <div class="invalid-feedback">{{ errors.email }}</div>
          </div>
          <div class="col-md-5">
            <label class="form-label" for="c-tel">Telefone</label>
            <input id="c-tel" v-model="form.telefone" class="form-control" placeholder="(91) 90000-0000" :class="{ 'is-invalid': errors.telefone }" />
            <div class="invalid-feedback">{{ errors.telefone }}</div>
          </div>
        </div>

        <h2 class="h5 fw-semibold mb-3">Endereço de entrega</h2>
        <div class="row g-3 mb-4">
          <div class="col-md-4">
            <label class="form-label" for="c-cep">CEP</label>
            <input id="c-cep" v-model="form.cep" class="form-control" placeholder="00000-000" :class="{ 'is-invalid': errors.cep }" />
            <div class="invalid-feedback">{{ errors.cep }}</div>
          </div>
          <div class="col-md-8">
            <label class="form-label" for="c-end">Endereço</label>
            <input id="c-end" v-model="form.endereco" class="form-control" :class="{ 'is-invalid': errors.endereco }" />
            <div class="invalid-feedback">{{ errors.endereco }}</div>
          </div>
          <div class="col-md-3">
            <label class="form-label" for="c-num">Número</label>
            <input id="c-num" v-model="form.numero" class="form-control" :class="{ 'is-invalid': errors.numero }" />
            <div class="invalid-feedback">{{ errors.numero }}</div>
          </div>
          <div class="col-md-6">
            <label class="form-label" for="c-cid">Cidade</label>
            <input id="c-cid" v-model="form.cidade" class="form-control" :class="{ 'is-invalid': errors.cidade }" />
            <div class="invalid-feedback">{{ errors.cidade }}</div>
          </div>
          <div class="col-md-3">
            <label class="form-label" for="c-uf">Estado</label>
            <input id="c-uf" v-model="form.estado" maxlength="2" class="form-control text-uppercase" :class="{ 'is-invalid': errors.estado }" />
            <div class="invalid-feedback">{{ errors.estado }}</div>
          </div>
        </div>

        <BaseButton class="py-3 px-5" @click="confirmOrder">Confirmar pedido</BaseButton>
      </form>

      <div class="col-lg-5">
        <CartSummary :total-items="totalItems" :subtotal="subtotal" :shipping="shipping" :total="total">
          <ul class="list-unstyled small mb-0">
            <li v-for="item in items" :key="item.id" class="d-flex justify-content-between py-1">
              <span>{{ item.quantity }}x {{ item.title }}</span>
              <span>{{ formatarPreco(item.price * item.quantity) }}</span>
            </li>
          </ul>
        </CartSummary>
      </div>
    </div>
  </div>
</template>
