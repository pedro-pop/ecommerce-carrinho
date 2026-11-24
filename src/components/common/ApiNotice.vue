<script setup>
// Aviso exibido quando a loja está usando os dados locais de reserva.
defineProps({ message: String, preview: { type: Boolean, default: false } })
const emit = defineEmits(['retry'])
</script>

<template>
  <div class="api-notice" role="status">
    <div v-if="preview">
      <strong>Pré-visualização.</strong>
      Este ambiente não acessa a internet; exibindo produtos locais de demonstração.
    </div>
    <template v-else>
      <div>
        <strong>API indisponível.</strong>
        Exibindo dados locais de reserva. <span class="text-secondary">({{ message }})</span>
      </div>
      <button class="btn btn-outline-dark btn-sm rounded-0" @click="emit('retry')">Tentar novamente</button>
    </template>
  </div>
</template>
