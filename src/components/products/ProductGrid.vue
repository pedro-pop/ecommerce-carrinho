<script setup>
import ProductCard from './ProductCard.vue'

defineProps({ products: { type: Array, required: true } })
// O grid só repassa o evento "add" do card para a tela (view).
const emit = defineEmits(['add'])
</script>

<template>
  <div class="row g-4">
    <div v-for="product in products" :key="product.id" class="col-6 col-lg-3">
      <ProductCard :product="product" @add="emit('add', $event)" />
    </div>
  </div>
</template>
