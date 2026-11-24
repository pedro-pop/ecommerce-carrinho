<script setup>
import AppHeader from './components/layout/AppHeader.vue'
import AppFooter from './components/layout/AppFooter.vue'
import ToastContainer from './components/common/ToastContainer.vue'
</script>

<template>
  <div class="app-shell">
    <AppHeader />
    <main class="flex-grow-1">
      <router-view v-slot="{ Component }">
        <Transition name="page" mode="out-in">
          <component :is="Component" />
        </Transition>
      </router-view>
    </main>
    <AppFooter />
    <ToastContainer />
  </div>
</template>
