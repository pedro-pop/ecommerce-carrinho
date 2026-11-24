<script setup>
import { computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useProducts } from '../composables/useProducts'
import { useCart } from '../composables/useCart'
import { useToast } from '../composables/useToast'
import ProductFilters from '../components/products/ProductFilters.vue'
import ProductGrid from '../components/products/ProductGrid.vue'
import LoadingSpinner from '../components/common/LoadingSpinner.vue'
import EmptyState from '../components/common/EmptyState.vue'
import ApiNotice from '../components/common/ApiNotice.vue'
import BaseButton from '../components/common/BaseButton.vue'

const route = useRoute()
const router = useRouter()
const { products, loading, error, usingFallback, previewMode, loadProducts, reloadProducts } = useProducts()
const { addItem } = useCart()
const { showToast } = useToast()

onMounted(loadProducts)

// A URL é a fonte única dos filtros: /produtos?q=relogio&categoria=mens-watches&ordem=menor
const search = computed(() => route.query.q ?? '')
const category = computed(() => route.query.categoria ?? '')
const sort = computed(() => route.query.ordem ?? 'relevancia')

function updateFilter(key, value) {
  router.replace({ query: { ...route.query, [key]: value || undefined } })
}

function clearFilters() {
  router.replace({ query: {} })
}

const filteredProducts = computed(() => {
  const term = search.value.trim().toLowerCase()

  let result = products.value.filter((product) => {
    const matchesCategory = !category.value || product.category === category.value
    const matchesSearch =
      !term ||
      product.title.toLowerCase().includes(term) ||
      product.description.toLowerCase().includes(term)
    return matchesCategory && matchesSearch
  })

  if (sort.value === 'menor') result = [...result].sort((a, b) => a.price - b.price)
  if (sort.value === 'maior') result = [...result].sort((a, b) => b.price - a.price)
  return result
})

function handleAdd(product) {
  addItem(product, 1)
  showToast(`${product.title} foi adicionado ao carrinho.`)
}
</script>

<template>
  <div class="container py-5">
    <h1 class="page-title">Produtos</h1>

    <ApiNotice v-if="usingFallback" :message="error" :preview="previewMode" @retry="reloadProducts" />

    <ProductFilters
      :search="search" :category="category" :sort="sort"
      @update:search="updateFilter('q', $event)"
      @update:category="updateFilter('categoria', $event)"
      @update:sort="updateFilter('ordem', $event === 'relevancia' ? '' : $event)"
    />

    <LoadingSpinner v-if="loading" />

    <template v-else>
      <p class="small text-secondary mb-3">
        {{ filteredProducts.length }} {{ filteredProducts.length === 1 ? 'produto encontrado' : 'produtos encontrados' }}
      </p>
      <ProductGrid v-if="filteredProducts.length > 0" :products="filteredProducts" @add="handleAdd" />
      <EmptyState v-else title="Nenhum produto encontrado"
                  message="Tente outro termo de pesquisa ou remova os filtros aplicados.">
        <BaseButton variant="outline" class="px-4" @click="clearFilters">Limpar filtros</BaseButton>
      </EmptyState>
    </template>
  </div>
</template>
