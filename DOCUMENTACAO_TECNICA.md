# Documentação Técnica — NOIR (E-commerce com carrinho)

Disciplina: Front-End Frameworks · UNAMA · Análise e Desenvolvimento de Sistemas

## A. Arquitetura

**Stack:** Vue 3 (Composition API, `<script setup>`), Vite, Vue Router 4, Bootstrap 5 (CSS) e CSS próprio para a identidade preto e branco. Não foi usado Pinia: um composable (`useCart`) com estado compartilhado é suficiente e mais simples de explicar.

### Estrutura de pastas

```
src/
├── assets/styles/main.css        identidade visual (tokens, cards, toasts)
├── components/
│   ├── layout/    AppHeader.vue, AppFooter.vue
│   ├── products/  ProductCard.vue, ProductGrid.vue, ProductFilters.vue
│   ├── cart/      CartItem.vue, CartSummary.vue
│   └── common/    BaseButton, LoadingSpinner, EmptyState, ApiNotice, ToastContainer, AppIcon
├── composables/   useCart.js, useProducts.js, useOrders.js, useToast.js
├── services/      productService.js, fallbackProducts.js
├── router/        index.js
├── views/         Home, Products, ProductDetail, Cart, Checkout, OrderSuccess, NotFound
├── App.vue
└── main.js
tests/             useCart.test.js, productService.test.js
```

### Responsabilidade de cada parte

| Arquivo | Responsabilidade |
|---|---|
| `AppHeader` | Logo, menu (com versão mobile), busca e ícone do carrinho com contador |
| `AppFooter` | Links reais para categorias, carrinho e checkout |
| `ProductCard` | Mostra um produto; emite `add` |
| `ProductGrid` | Repete cards com `v-for` e repassa `add` |
| `ProductFilters` | Campos de busca, categoria e ordenação; emite `update:*` |
| `CartItem` | Uma linha do carrinho; emite `increase`, `decrease`, `remove` |
| `CartSummary` | Itens, subtotal, frete e total (recebe por props) |
| `BaseButton`, `LoadingSpinner`, `EmptyState`, `ApiNotice`, `ToastContainer`, `AppIcon` | Peças reutilizáveis |
| `useCart` | Toda a lógica do carrinho (estado, cálculos, localStorage) |
| `useProducts` | Carrega produtos uma vez e controla loading, erro e fallback |
| `useOrders` | Cria e guarda o pedido demonstrativo |
| `useToast` | Notificações de sucesso/erro |
| `productService` | Única camada que fala com a API |
| `views/*` | Telas ligadas às rotas; decidem o que fazer com os eventos |

### Fluxo de funcionamento

1. `main.js` cria o app, instala o router e carrega Bootstrap e o CSS próprio.
2. `App.vue` monta Header, `<router-view>`, Footer e as notificações.
3. A tela aberta chama `loadProducts()` (`onMounted`), que usa `productService.fetchProducts()`.
4. O usuário clica em **Adicionar**: card → grid → tela → `useCart.addItem()` → toast.
5. O contador do header, o carrinho e o checkout leem o mesmo estado de `useCart`.
6. No checkout, o formulário é validado, `useOrders.createOrder()` gera o pedido, o carrinho é limpo e o usuário vai para a confirmação.

## B. Vue.js

- **`ref()`**: `useCart.js` (`items`), `useProducts.js` (`products`, `loading`, `error`, `usingFallback`), `AppHeader.vue` (`searchTerm`, `menuOpen`), `ProductDetailView.vue` (`quantity`), `CheckoutView.vue` (`errors`, `orderPlaced`). `reactive()` é usado no objeto `form` do checkout.
- **`computed()`**: `totalItems`, `subtotal`, `shipping`, `total` (`useCart.js`); `filteredProducts`, `search`, `category`, `sort` (`ProductsView.vue`); `destaques`, `vitrine`, `categorias` (`HomeView.vue`); `product` (`ProductDetailView.vue`).
- **`watch()`**: grava o carrinho no localStorage (`useCart.js`); sincroniza a busca com a URL e fecha o menu mobile (`AppHeader.vue`); redireciona do checkout se o carrinho estiver vazio (`CheckoutView.vue`).
- **`onMounted()`**: `loadProducts` em Home, Products e ProductDetail; verificação do pedido em OrderSuccess.
- **Eventos**: `@click` (botões de adicionar, quantidade, remover, menu), `@submit.prevent` (busca e checkout), `@input` e `@change` (filtros), `@error` (imagem quebrada).
- **Diretivas**: `v-for` (grids, carrinho, categorias), `v-if`/`v-else-if`/`v-else` (loading, vazio, erro), `v-model` (busca do header, formulário), `:class`, `:src`, `:to`, `<slot>`.
- **Comunicação entre componentes**:
  - Pai → filho por **props** (`ProductCard`, `CartItem`, `CartSummary`, `ProductFilters`).
  - Filho → pai por **emits** (`add`, `increase`, `decrease`, `remove`, `update:search`...).
  - Estado global por **composables** (`useCart`, `useProducts`, `useToast`, `useOrders`).
  - **Slots** em `EmptyState` e `CartSummary` para o pai escolher o conteúdo.

## C. Carrinho

- **Adicionar**: `addItem(product, quantity)` procura o produto; se existe soma a quantidade, senão insere um item novo.
- **Quantidade**: `setQuantity(id, quantity)` aplica `limitar` (mínimo 1, máximo 10). O botão − fica desabilitado em 1 e o + em 10.
- **Remover**: `removeItem(id)` refaz a lista sem o produto.
- **Total**: `subtotal` soma `preço × quantidade`; `shipping` é R$ 29,90 (grátis a partir de R$ 500); `total = subtotal + shipping`. Tudo é `computed`.
- **Persistência**: um `watch` profundo grava o array em `localStorage` (chave `noir-cart`); ao iniciar, `loadCart()` lê e valida o JSON (com `try/catch` para dados corrompidos).

## D. Vue Router

- Rotas em `src/router/index.js`: `/`, `/produtos`, `/produto/:id`, `/carrinho`, `/checkout`, `/pedido-confirmado` e `/:pathMatch(.*)*` (404).
- Navegação por `<router-link>` e, em código, por `router.push` / `router.replace`.
- Parâmetro de rota: `/produto/:id` → `route.params.id` em `ProductDetailView`.
- Query string: `/produtos?q=...&categoria=...&ordem=...`. A URL é a fonte única dos filtros: o header e o `ProductFilters` alteram a query, e `ProductsView` lê com `computed`. Assim, os filtros sobrevivem ao recarregar e podem ser compartilhados por link.
- `scrollBehavior` volta ao topo a cada navegação.

## E. API

- **API**: DummyJSON — `https://dummyjson.com/products?limit=0` (sem chave, pública).
- **Requisição**: `fetchProducts()` em `productService.js`, com `fetch`, `async/await` e limite de 8 s.
- **Tratamento dos dados**: `normalizeProduct` padroniza campos ausentes e converte o preço (a API usa dólar; a loja demonstrativa multiplica por 5, constante `COTACAO_DEMO`). Só as categorias de `CATEGORIAS` são exibidas.
- **Caminho até a tela**: `productService` → `useProducts` (`products`) → views → `ProductGrid` → `ProductCard`.
- **Erros**: status HTTP inválido, formato inesperado, lista vazia e timeout lançam `Error`. O `useProducts` captura, guarda a mensagem e usa `fallbackProducts.js` (8 produtos locais). A tela mostra o `ApiNotice` com o botão **Tentar novamente**. Imagens quebradas são trocadas por um placeholder (`handleImageError`).
- **Observação**: os dados locais existem apenas como reserva e são sempre identificados na interface.

## F. Framework CSS

- **Bootstrap 5.3** (somente CSS, sem JavaScript do Bootstrap).
- **Uso**: grid (`container`, `row`, `col-*`), utilitários (`d-flex`, `gap-*`, `py-*`), formulários (`form-control`, `form-select`, `is-invalid`, `invalid-feedback`), botões (`btn`, `btn-dark`, `btn-outline-dark`), `navbar`, `collapse`, `spinner-border`.
- **Responsividade**: grid `col-6 col-lg-3` (2 colunas no celular, 4 no desktop), menu que recolhe abaixo de `lg` (controlado por `menuOpen`), resumo do pedido que deixa de ser fixo no mobile.
- **Personalização**: `main.css` define a paleta (#090909, #FFFFFF, #171717, #777777, #F2F2F2), cantos retos, hover dos cards e animações sutis.

## G. Trechos de código para apresentação

### 1. Estado do carrinho e persistência

**Arquivo:** `src/composables/useCart.js`

```js
const items = ref(loadCart())

// Sempre que o carrinho muda, grava no localStorage.
watch(items, (value) => localStorage.setItem(STORAGE_KEY, JSON.stringify(value)), { deep: true })
```

**O que faz:** `items` é uma variável reativa criada uma única vez (fora da função `useCart`), por isso todos os componentes enxergam o mesmo carrinho. O `watch` com `deep: true` observa mudanças dentro dos itens (como a quantidade) e grava tudo no localStorage. Ao recarregar a página, `loadCart()` lê esse valor de volta.

**Conceito:** `ref`, `watch`, localStorage.

**Como falar:** “`items` é uma variável reativa criada uma única vez (fora da função `useCart`), por isso todos os componentes enxergam o mesmo carrinho.”

### 2. Totais calculados automaticamente

**Arquivo:** `src/composables/useCart.js`

```js
const totalItems = computed(() => items.value.reduce((sum, item) => sum + item.quantity, 0))
const subtotal = computed(() =>
  items.value.reduce((sum, item) => sum + item.price * item.quantity, 0),
)
const shipping = computed(() => {
  if (items.value.length === 0 || subtotal.value >= FRETE_GRATIS_ACIMA_DE) return 0
  return FRETE_FIXO
})
const total = computed(() => subtotal.value + shipping.value)
```

**O que faz:** Os valores derivados são `computed`: o Vue recalcula sozinho quando `items` muda. Não existe nenhum código manual de “atualizar total”. O frete é grátis acima de R$ 500 (regra demonstrativa).

**Conceito:** `computed`.

**Como falar:** “Os valores derivados são `computed`: o Vue recalcula sozinho quando `items` muda.”

### 3. Adicionar produto ao carrinho

**Arquivo:** `src/composables/useCart.js`

```js
function addItem(product, quantity = 1) {
    const existing = items.value.find((item) => item.id === product.id)
    if (existing) {
      existing.quantity = limitar(existing.quantity + quantity)
      return
    }
    // Guardamos só o necessário do produto (uma "foto" dele no momento da compra).
    items.value.push({
      id: product.id,
      title: product.title,
      price: product.price,
      category: product.category,
      image: product.images?.[0] || product.thumbnail || '',
      quantity: limitar(quantity),
    })
  }
```

**O que faz:** Se o produto já está no carrinho, só somamos a quantidade; senão guardamos uma cópia enxuta dele. `limitar` mantém a quantidade entre 1 e 10.

**Conceito:** Lógica centralizada, composable.

**Como falar:** “Se o produto já está no carrinho, só somamos a quantidade; senão guardamos uma cópia enxuta dele.”

### 4. Consumo da API com tratamento de erros

**Arquivo:** `src/services/productService.js`

```js
export async function fetchProducts() {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS)

  try {
    const response = await fetch(API_URL, { signal: controller.signal })
    if (!response.ok) {
      throw new Error(`A API respondeu com status ${response.status}.`)
    }

    const data = await response.json()
    if (!data || !Array.isArray(data.products)) {
      throw new Error('A API devolveu uma resposta em formato inesperado.')
    }

    const products = data.products
      .filter((item) => item.category in CATEGORIAS)
      .map(normalizeProduct)

    if (products.length === 0) {
      throw new Error('A API não devolveu produtos das categorias da loja.')
    }
    return products
  } catch (error) {
    if (error.name === 'AbortError') throw new Error('A API demorou demais para responder.')
    throw error
  } finally {
    clearTimeout(timer)
  }
}
```

**O que faz:** Faz o `fetch` na DummyJSON com limite de tempo (AbortController). Verifica o status HTTP e o formato da resposta antes de usar os dados, filtra as categorias da loja e converte cada item com `normalizeProduct`. Qualquer falha vira um `Error` com mensagem em português.

**Conceito:** Requisição HTTP assíncrona, `async/await`, `try/catch`.

**Como falar:** “Faz o `fetch` na DummyJSON com limite de tempo (AbortController).”

### 5. Carregamento com estratégia de fallback

**Arquivo:** `src/composables/useProducts.js`

```js
async function loadProducts() {
    if (loaded || loading.value) return
    if (previewMode) {
      products.value = getFallbackProducts()
      usingFallback.value = true
      loaded = true
      return
    }
    loading.value = true
    error.value = ''
    try {
      products.value = await fetchProducts()
      usingFallback.value = false
      loaded = true
    } catch (e) {
      // Falhou: mostramos o aviso e usamos os dados locais de reserva.
      error.value = e.message
      products.value = getFallbackProducts()
      usingFallback.value = true
    } finally {
      loading.value = false
    }
  }
```

**O que faz:** A tela não sabe de onde vêm os dados. Se a API falha, guardamos a mensagem de erro, ativamos `usingFallback` e usamos a lista local. A interface mostra um aviso explícito (componente `ApiNotice`).

**Conceito:** `ref` de loading/erro, assíncrono.

**Como falar:** “A tela não sabe de onde vêm os dados.”

### 6. Pesquisa, filtro por categoria e ordenação

**Arquivo:** `src/views/ProductsView.vue`

```vue
const filteredProducts = computed(() => {
  const term = search.value.trim().toLowerCase()

  let result = products.value.filter((product) => {
    const matchesCategory = !category.value || product.category === category.value
    const matchesSearch =
      !term ||
      product.title.toLowerCase().includes(term) ||
      product.description.toLowerCase().includes(term)
    return matchesCategory && matchesSearch
  })

  if (sort.value === 'menor') result = [...result].sort((a, b) => a.price - b.price)
  if (sort.value === 'maior') result = [...result].sort((a, b) => b.price - a.price)
  return result
})
```

**O que faz:** A lista exibida é derivada de três valores (busca, categoria, ordem). Quando qualquer um muda, o `computed` recalcula e o `v-for` redesenha a grade.

**Conceito:** `computed`, reatividade.

**Como falar:** “A lista exibida é derivada de três valores (busca, categoria, ordem).”

### 7. Props e emits no card

**Arquivo:** `src/components/products/ProductCard.vue`

```vue
defineProps({ product: { type: Object, required: true } })
const emit = defineEmits(['add'])
```

**O que faz:** O card recebe o produto por **prop** (pai → filho) e avisa o pai com um **emit** (filho → pai). Ele não mexe no carrinho: quem decide o que fazer é a tela.

**Conceito:** Comunicação entre componentes.

**Como falar:** “O card recebe o produto por **prop** (pai → filho) e avisa o pai com um **emit** (filho → pai).”

### 8. Grid repassando o evento

**Arquivo:** `src/components/products/ProductGrid.vue`

```vue
<ProductCard :product="product" @add="emit('add', $event)" />
```

**O que faz:** O grid percorre os produtos com `v-for` e repassa o evento `add` do card até a tela (HomeView/ProductsView), que chama `addItem` e exibe a notificação.

**Conceito:** `v-for`, `:key`, eventos.

**Como falar:** “O grid percorre os produtos com `v-for` e repassa o evento `add` do card até a tela (HomeView/ProductsView), que chama `addItem` e exibe a notificação.”

### 9. Tabela de rotas

**Arquivo:** `src/router/index.js`

```js
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
```

**O que faz:** Cada rota liga um endereço a uma tela. `/produto/:id` tem parâmetro dinâmico; a última rota captura qualquer endereço inexistente e mostra a página 404.

**Conceito:** Vue Router, rotas dinâmicas e 404.

**Como falar:** “Cada rota liga um endereço a uma tela.”

### 10. Parâmetro da rota escolhe o produto

**Arquivo:** `src/views/ProductDetailView.vue`

```vue
const product = computed(() => findById(route.params.id))
```

**O que faz:** `route.params.id` vem da URL (`/produto/12`). Como é um `computed`, ao navegar para outro produto a tela atualiza sozinha.

**Conceito:** `useRoute`, `route.params`.

**Como falar:** “`route.params.id` vem da URL (`/produto/12`).”

### 11. Validação do formulário

**Arquivo:** `src/views/CheckoutView.vue`

```vue
function validate() {
  const e = {}
  if (form.nome.trim().length < 3) e.nome = 'Informe seu nome completo.'
  if (!/^\S+@\S+\.\S+$/.test(form.email)) e.email = 'Informe um e-mail válido.'
  if (apenasDigitos(form.telefone).length < 10) e.telefone = 'Informe DDD e telefone.'
  if (apenasDigitos(form.cep).length !== 8) e.cep = 'O CEP deve ter 8 dígitos.'
  if (form.endereco.trim().length < 3) e.endereco = 'Informe o endereço.'
  if (!form.numero.trim()) e.numero = 'Informe o número.'
  if (form.cidade.trim().length < 2) e.cidade = 'Informe a cidade.'
  if (!/^[A-Za-z]{2}$/.test(form.estado)) e.estado = 'Use a sigla (ex.: PA).'
  errors.value = e
  return Object.keys(e).length === 0
}
```

**O que faz:** Cada campo do `form` (ligado por `v-model`) é checado. Os erros vão para `errors`, e o template aplica a classe `is-invalid` do Bootstrap e mostra a mensagem.

**Conceito:** `v-model`, `reactive`, validação básica.

**Como falar:** “Cada campo do `form` (ligado por `v-model`) é checado.”

## Testes automatizados

`npm test` executa 10 testes (Vitest): carrinho (adicionar, somar, limites de quantidade, frete, remover, localStorage) e serviço de API (normalização, filtro de categorias, erro de status e formato inesperado).

## Limitações conhecidas

- O pedido é demonstrativo: fica só no navegador, sem back-end e sem pagamento.
- O preço é a cotação fixa de 5× sobre o valor em dólar da API.
- As fotos vêm da DummyJSON; sem internet aparece um placeholder.
