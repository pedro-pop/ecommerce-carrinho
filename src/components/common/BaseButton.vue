<script setup>
// Botão reutilizável. O @click do pai funciona porque o evento "cai" no <button> raiz.
defineProps({
  variant: { type: String, default: 'dark' }, // dark | outline
  block: { type: Boolean, default: false },
  loading: { type: Boolean, default: false },
})
</script>

<template>
  <button
    type="button"
    class="btn rounded-0 fw-semibold"
    :class="[variant === 'outline' ? 'btn-outline-dark' : 'btn-dark', { 'w-100': block }]"
    :disabled="loading"
  >
    <span v-if="loading" class="spinner-border spinner-border-sm me-2" aria-hidden="true"></span>
    <slot />
  </button>
</template>
