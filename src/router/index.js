import { createRouter, createWebHistory, createWebHashHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import ProductsView from '../views/ProductsView.vue'
import ProductDetailView from '../views/ProductDetailView.vue'
import CartView from '../views/CartView.vue'
import CheckoutView from '../views/CheckoutView.vue'
import OrderSuccessView from '../views/OrderSuccessView.vue'
import NotFoundView from '../views/NotFoundView.vue'

const routes = [
  { path: '/', name: 'home', component: HomeView },
  { path: '/produtos', name: 'products', component: ProductsView },
  // ":id" é um parâmetro dinâmico: /produto/12 -> route.params.id === '12'
  { path: '/produto/:id', name: 'product-detail', component: ProductDetailView },
  { path: '/carrinho', name: 'cart', component: CartView },
  { path: '/checkout', name: 'checkout', component: CheckoutView },
  { path: '/pedido-confirmado', name: 'order-success', component: OrderSuccessView },
  // Qualquer outro endereço cai na página 404
  { path: '/:pathMatch(.*)*', name: 'not-found', component: NotFoundView },
]

// Em produção usamos URLs limpas; o modo "hash" existe só para a pré-visualização em arquivo único.
const history =
  import.meta.env.VITE_ROUTER_MODE === 'hash' ? createWebHashHistory() : createWebHistory()

export default createRouter({
  history,
  routes,
  scrollBehavior: () => ({ top: 0 }),
})
