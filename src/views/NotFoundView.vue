<script setup>
import EmptyState from '../components/common/EmptyState.vue'
</script>

<template>
  <div class="container py-5">
    <EmptyState title="Página não encontrada" message="O endereço que você acessou não existe nesta loja.">
      <router-link to="/" class="btn btn-dark rounded-0 px-4">Ir para o início</router-link>
    </EmptyState>
  </div>
</template>
