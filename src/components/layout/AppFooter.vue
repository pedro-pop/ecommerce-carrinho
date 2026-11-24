<script setup>
import { CATEGORIAS } from '../../services/productService'

const destaques = Object.entries(CATEGORIAS).slice(0, 4)
</script>

<template>
  <footer class="site-footer">
    <div class="container py-5">
      <div class="row g-4">
        <div class="col-md-5">
          <div class="logo mb-3">NOIR</div>
          <p class="text-secondary mb-0" style="max-width: 320px">
            Peças essenciais em preto e branco. Projeto acadêmico de e-commerce — nenhuma compra é real.
          </p>
        </div>
        <div class="col-6 col-md-3">
          <h3 class="footer-title">Loja</h3>
          <ul class="list-unstyled mb-0">
            <li><router-link to="/produtos">Todos os produtos</router-link></li>
            <li v-for="[slug, nome] in destaques" :key="slug">
              <router-link :to="{ name: 'products', query: { categoria: slug } }">{{ nome }}</router-link>
            </li>
          </ul>
        </div>
        <div class="col-6 col-md-4">
          <h3 class="footer-title">Sua conta</h3>
          <ul class="list-unstyled mb-0">
            <li><router-link to="/carrinho">Carrinho</router-link></li>
            <li><router-link to="/checkout">Finalizar pedido</router-link></li>
          </ul>
        </div>
      </div>
      <hr class="my-4" />
      <p class="small text-secondary mb-0">
        © 2026 NOIR — UNAMA · Front-End Frameworks · Análise e Desenvolvimento de Sistemas
      </p>
    </div>
  </footer>
</template>
