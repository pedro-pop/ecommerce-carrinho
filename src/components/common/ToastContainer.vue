<script setup>
import { useToast } from '../../composables/useToast'
import AppIcon from './AppIcon.vue'

const { toasts, dismissToast } = useToast()
</script>

<template>
  <div class="toast-area" aria-live="polite">
    <TransitionGroup name="toast">
      <div v-for="toast in toasts" :key="toast.id" class="toast-noir"
           :class="{ 'toast-noir--error': toast.type === 'error' }">
        <AppIcon :name="toast.type === 'error' ? 'close' : 'check'" :size="18" />
        <span>{{ toast.message }}</span>
        <button class="btn-close btn-close-white ms-auto" aria-label="Fechar"
                @click="dismissToast(toast.id)"></button>
      </div>
    </TransitionGroup>
  </div>
</template>
