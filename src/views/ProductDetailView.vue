<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useProducts } from '../composables/useProducts'
import { useCart } from '../composables/useCart'
import { useToast } from '../composables/useToast'
import { imageOf, handleImageError, formatarPreco, nomeCategoria } from '../services/productService'
import LoadingSpinner from '../components/common/LoadingSpinner.vue'
import EmptyState from '../components/common/EmptyState.vue'
import BaseButton from '../components/common/BaseButton.vue'
import AppIcon from '../components/common/AppIcon.vue'

const route = useRoute()
const { loading, loadProducts, findById } = useProducts()
const { addItem, MAX_POR_ITEM } = useCart()
const { showToast } = useToast()

const quantity = ref(1)

onMounted(loadProducts)

// O parâmetro :id da rota (/produto/:id) escolhe qual produto exibir.
const product = computed(() => findById(route.params.id))

function addToCart() {
  addItem(product.value, quantity.value)
  showToast(`${quantity.value}x ${product.value.title} no carrinho.`)
  quantity.value = 1
}
</script>

<template>
  <div class="container py-5">
    <LoadingSpinner v-if="loading" label="Carregando produto..." />

    <div v-else-if="product" class="row g-5">
      <div class="col-md-6">
        <div class="detail-media">
          <img :src="imageOf(product)" :alt="product.title" @error="handleImageError($event, product.title)" />
        </div>
      </div>
      <div class="col-md-6">
        <router-link :to="{ name: 'products', query: { categoria: product.category } }" class="product-category">
          {{ nomeCategoria(product.category) }}
        </router-link>
        <h1 class="page-title mt-2">{{ product.title }}</h1>
        <p v-if="product.rating" class="text-secondary d-flex align-items-center gap-1">
          <AppIcon name="star" :size="16" /> {{ product.rating.toFixed(1) }} de 5
        </p>
        <p class="detail-price">{{ formatarPreco(product.price) }}</p>
        <p class="text-secondary">{{ product.description }}</p>

        <div class="mt-4">
          <label class="form-label small text-uppercase">Quantidade</label>
          <div class="qty qty-lg">
            <button aria-label="Diminuir" :disabled="quantity <= 1" @click="quantity--">
              <AppIcon name="minus" :size="16" />
            </button>
            <span>{{ quantity }}</span>
            <button aria-label="Aumentar" :disabled="quantity >= MAX_POR_ITEM" @click="quantity++">
              <AppIcon name="plus" :size="16" />
            </button>
          </div>
        </div>

        <div class="d-flex flex-wrap gap-3 mt-4">
          <BaseButton class="px-5 py-2" @click="addToCart">Adicionar ao carrinho</BaseButton>
          <router-link to="/produtos" class="btn btn-outline-dark rounded-0 px-4 py-2">Voltar</router-link>
        </div>
      </div>
    </div>

    <EmptyState v-else title="Produto não encontrado" message="Este produto não existe ou foi removido.">
      <router-link to="/produtos" class="btn btn-dark rounded-0 px-4">Ver produtos</router-link>
    </EmptyState>
  </div>
</template>
