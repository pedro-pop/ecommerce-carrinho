<script setup>
import { imageOf, handleImageError, formatarPreco, nomeCategoria } from '../../services/productService'
import BaseButton from '../common/BaseButton.vue'

// Props: dados que chegam do pai. Emits: avisos que o card envia ao pai.
defineProps({ product: { type: Object, required: true } })
const emit = defineEmits(['add'])
</script>

<template>
  <article class="product-card h-100">
    <router-link :to="{ name: 'product-detail', params: { id: product.id } }" class="product-media">
      <img :src="imageOf(product)" :alt="product.title" loading="lazy"
           @error="handleImageError($event, product.title)" />
    </router-link>
    <div class="product-body">
      <span class="product-category">{{ nomeCategoria(product.category) }}</span>
      <h3 class="product-title">
        <router-link :to="{ name: 'product-detail', params: { id: product.id } }">{{ product.title }}</router-link>
      </h3>
      <p class="product-price">{{ formatarPreco(product.price) }}</p>
      <div class="d-flex gap-2 mt-auto">
        <router-link :to="{ name: 'product-detail', params: { id: product.id } }"
                     class="btn btn-outline-dark rounded-0 flex-fill btn-sm py-2">Ver</router-link>
        <BaseButton class="flex-fill btn-sm" @click="emit('add', product)">Adicionar</BaseButton>
      </div>
    </div>
  </article>
</template>
