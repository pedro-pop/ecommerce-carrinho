<script setup>
import { computed, onMounted } from 'vue'
import { useProducts } from '../composables/useProducts'
import { useCart } from '../composables/useCart'
import { useToast } from '../composables/useToast'
import { CATEGORIAS } from '../services/productService'
import ProductGrid from '../components/products/ProductGrid.vue'
import LoadingSpinner from '../components/common/LoadingSpinner.vue'
import ApiNotice from '../components/common/ApiNotice.vue'
import AppIcon from '../components/common/AppIcon.vue'

const { products, loading, error, usingFallback, previewMode, loadProducts, reloadProducts } = useProducts()
const { addItem } = useCart()
const { showToast } = useToast()

onMounted(loadProducts)

// Destaques = os 4 produtos mais bem avaliados; vitrine = os 8 seguintes.
const ordenados = computed(() =>
  [...products.value].sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0)),
)
const destaques = computed(() => ordenados.value.slice(0, 4))
const vitrine = computed(() => ordenados.value.slice(4, 12))

const categorias = computed(() =>
  Object.entries(CATEGORIAS).map(([slug, nome]) => ({
    slug,
    nome,
    total: products.value.filter((p) => p.category === slug).length,
  })),
)

function handleAdd(product) {
  addItem(product, 1)
  showToast(`${product.title} foi adicionado ao carrinho.`)
}
</script>

<template>
  <div>
    <section class="hero">
      <div class="container">
        <p class="hero-eyebrow">Coleção 2026</p>
        <h1 class="hero-title">Menos ruído.<br />Mais presença.</h1>
        <p class="hero-text">
          Relógios, óculos, calçados e perfumes em preto e branco. Frete grátis em pedidos acima de R$ 500.
        </p>
        <div class="d-flex flex-wrap gap-3">
          <router-link to="/produtos" class="btn btn-light rounded-0 px-4 py-3 fw-semibold">
            Ver coleção <AppIcon name="arrow" :size="18" />
          </router-link>
          <router-link :to="{ name: 'products', query: { categoria: 'fragrances' } }"
                       class="btn btn-outline-light rounded-0 px-4 py-3">Perfumes</router-link>
        </div>
      </div>
    </section>

    <div class="container py-5">
      <ApiNotice v-if="usingFallback" :message="error" :preview="previewMode" @retry="reloadProducts" />
      <LoadingSpinner v-if="loading" />

      <template v-else>
        <section class="mb-5">
          <h2 class="section-title">Categorias</h2>
          <div class="row g-3">
            <div v-for="cat in categorias" :key="cat.slug" class="col-6 col-md-3">
              <router-link :to="{ name: 'products', query: { categoria: cat.slug } }" class="category-tile">
                <span>{{ cat.nome }}</span>
                <small>{{ cat.total }} {{ cat.total === 1 ? 'produto' : 'produtos' }}</small>
              </router-link>
            </div>
          </div>
        </section>

        <section class="mb-5">
          <h2 class="section-title">Em destaque</h2>
          <ProductGrid :products="destaques" @add="handleAdd" />
        </section>

        <section v-if="vitrine.length">
          <div class="d-flex justify-content-between align-items-end">
            <h2 class="section-title">Mais produtos</h2>
            <router-link to="/produtos" class="small text-dark mb-4">Ver todos</router-link>
          </div>
          <ProductGrid :products="vitrine" @add="handleAdd" />
        </section>
      </template>
    </div>
  </div>
</template>
