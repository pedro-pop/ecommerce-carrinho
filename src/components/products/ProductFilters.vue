<script setup>
import { CATEGORIAS } from '../../services/productService'

defineProps({
  search: { type: String, default: '' },
  category: { type: String, default: '' },
  sort: { type: String, default: 'relevancia' },
})
const emit = defineEmits(['update:search', 'update:category', 'update:sort'])
</script>

<template>
  <div class="row g-3 align-items-end mb-4">
    <div class="col-12 col-md-5">
      <label class="form-label small text-uppercase" for="f-busca">Pesquisar</label>
      <input id="f-busca" type="search" class="form-control" placeholder="Nome ou descrição"
             :value="search" @input="emit('update:search', $event.target.value)" />
    </div>
    <div class="col-6 col-md-4">
      <label class="form-label small text-uppercase" for="f-cat">Categoria</label>
      <select id="f-cat" class="form-select" :value="category"
              @change="emit('update:category', $event.target.value)">
        <option value="">Todas</option>
        <option v-for="(nome, slug) in CATEGORIAS" :key="slug" :value="slug">{{ nome }}</option>
      </select>
    </div>
    <div class="col-6 col-md-3">
      <label class="form-label small text-uppercase" for="f-ord">Ordenar</label>
      <select id="f-ord" class="form-select" :value="sort"
              @change="emit('update:sort', $event.target.value)">
        <option value="relevancia">Relevância</option>
        <option value="menor">Menor preço</option>
        <option value="maior">Maior preço</option>
      </select>
    </div>
  </div>
</template>
