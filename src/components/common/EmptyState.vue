<script setup>
defineProps({ title: String, message: String })
</script>

<template>
  <div class="empty-state text-center py-5 px-3">
    <h2 class="h4 fw-semibold">{{ title }}</h2>
    <p class="text-secondary mx-auto" style="max-width: 420px">{{ message }}</p>
    <!-- Slot: o componente que usa o EmptyState decide quais botões aparecem -->
    <slot />
  </div>
</template>
