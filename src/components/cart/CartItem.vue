<script setup>
import { formatarPreco, handleImageError, placeholderImage } from '../../services/productService'
import AppIcon from '../common/AppIcon.vue'

defineProps({ item: { type: Object, required: true }, max: { type: Number, default: 10 } })
const emit = defineEmits(['increase', 'decrease', 'remove'])
</script>

<template>
  <div class="cart-item">
    <router-link :to="{ name: 'product-detail', params: { id: item.id } }" class="cart-thumb">
      <img :src="item.image || placeholderImage(item.title)" :alt="item.title"
           @error="handleImageError($event, item.title)" />
    </router-link>
    <div class="flex-grow-1">
      <router-link :to="{ name: 'product-detail', params: { id: item.id } }" class="fw-semibold text-dark">
        {{ item.title }}
      </router-link>
      <div class="small text-secondary">{{ formatarPreco(item.price) }} cada</div>
      <div class="qty mt-2">
        <button aria-label="Diminuir quantidade" :disabled="item.quantity <= 1"
                @click="emit('decrease', item.id)"><AppIcon name="minus" :size="18" /></button>
        <span>{{ item.quantity }}</span>
        <button aria-label="Aumentar quantidade" :disabled="item.quantity >= max"
                @click="emit('increase', item.id)"><AppIcon name="plus" :size="18" /></button>
      </div>
    </div>
    <div class="text-end">
      <div class="fw-bold">{{ formatarPreco(item.price * item.quantity) }}</div>
      <button class="remove-btn mt-2" @click="emit('remove', item.id)">
        <AppIcon name="trash" :size="16" /> Remover
      </button>
    </div>
  </div>
</template>
