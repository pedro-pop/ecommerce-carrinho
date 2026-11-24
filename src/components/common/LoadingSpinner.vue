<script setup>
defineProps({ label: { type: String, default: 'Carregando produtos...' } })
</script>

<template>
  <div class="text-center py-5" role="status">
    <div class="spinner-border text-dark" aria-hidden="true"></div>
    <p class="mt-3 mb-0 text-secondary">{{ label }}</p>
  </div>
</template>
