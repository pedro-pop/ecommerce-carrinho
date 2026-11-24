<script setup>
import { ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useCart } from '../../composables/useCart'
import AppIcon from '../common/AppIcon.vue'

const route = useRoute()
const router = useRouter()
const { totalItems } = useCart()

const searchTerm = ref('')
const menuOpen = ref(false)

// Mantém o campo de busca igual ao ?q= da URL.
watch(() => route.query.q, (q) => (searchTerm.value = q ?? ''), { immediate: true })
// Fecha o menu mobile ao trocar de página.
watch(() => route.fullPath, () => (menuOpen.value = false))

function submitSearch() {
  const q = searchTerm.value.trim()
  router.push({ name: 'products', query: q ? { q } : {} })
}
</script>

<template>
  <header class="site-header">
    <nav class="navbar navbar-expand-lg container py-3">
      <router-link to="/" class="navbar-brand logo">NOIR</router-link>

      <div class="d-flex align-items-center gap-2 order-lg-3">
        <router-link to="/carrinho" class="cart-link" aria-label="Abrir carrinho">
          <AppIcon name="cart" :size="22" />
          <span v-if="totalItems > 0" class="cart-badge">{{ totalItems }}</span>
        </router-link>
        <button class="navbar-toggler border-0 d-lg-none" aria-label="Abrir menu"
                @click="menuOpen = !menuOpen">
          <AppIcon :name="menuOpen ? 'close' : 'menu'" :size="24" />
        </button>
      </div>

      <div class="navbar-collapse collapse order-lg-2" :class="{ show: menuOpen }">
        <ul class="navbar-nav mx-lg-auto gap-lg-3 my-3 my-lg-0">
          <li class="nav-item">
            <router-link to="/" class="nav-link">Início</router-link>
          </li>
          <li class="nav-item">
            <router-link to="/produtos" class="nav-link">Produtos</router-link>
          </li>
          <li class="nav-item">
            <router-link to="/carrinho" class="nav-link">Carrinho</router-link>
          </li>
        </ul>
        <form class="search-form" role="search" @submit.prevent="submitSearch">
          <input v-model="searchTerm" type="search" class="form-control" placeholder="Buscar produtos"
                 aria-label="Buscar produtos" />
          <button class="search-btn" aria-label="Buscar"><AppIcon name="search" :size="18" /></button>
        </form>
      </div>
    </nav>
  </header>
</template>
