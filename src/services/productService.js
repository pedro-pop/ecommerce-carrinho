import { fallbackProducts } from './fallbackProducts'

// Camada de serviço: só ela conhece a API. As telas apenas chamam estas funções.
const API_URL = 'https://dummyjson.com/products?limit=0'
const TIMEOUT_MS = 8000

// A API cobra em dólar. Para a loja demonstrativa multiplicamos por uma cotação fixa.
export const COTACAO_DEMO = 5

// Categorias da API que a loja exibe, com o nome em português.
export const CATEGORIAS = {
  'mens-watches': 'Relógios masculinos',
  'womens-watches': 'Relógios femininos',
  sunglasses: 'Óculos de sol',
  'mens-shoes': 'Calçados masculinos',
  'womens-shoes': 'Calçados femininos',
  'womens-bags': 'Bolsas',
  fragrances: 'Perfumes',
  'mens-shirts': 'Camisas',
}

export const nomeCategoria = (slug) => CATEGORIAS[slug] ?? slug

export const formatarPreco = (valor) =>
  Number(valor).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })

// Converte o formato da API para o formato usado pela nossa interface.
export function normalizeProduct(raw) {
  return {
    id: raw.id,
    title: raw.title ?? 'Produto sem nome',
    description: raw.description ?? '',
    price: Math.round((Number(raw.price) || 0) * COTACAO_DEMO),
    category: raw.category,
    brand: raw.brand ?? '',
    rating: raw.rating ?? null,
    stock: raw.stock ?? 0,
    thumbnail: raw.thumbnail ?? '',
    images: Array.isArray(raw.images) ? raw.images : [],
  }
}

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

export const getFallbackProducts = () => fallbackProducts

// Imagem gerada localmente, usada quando o produto não tem foto ou a foto não carrega.
export function placeholderImage(title = '') {
  const letras = title.trim().slice(0, 2).toUpperCase()
  const svg =
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400">` +
    `<rect width="400" height="400" fill="#F2F2F2"/>` +
    `<text x="200" y="225" font-family="Arial,sans-serif" font-size="96" font-weight="700" ` +
    `text-anchor="middle" fill="#171717" opacity="0.18">${letras}</text></svg>`
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`
}

export const imageOf = (product) =>
  product.images[0] || product.thumbnail || placeholderImage(product.title)

// Usado em @error nas <img>: troca a foto quebrada pelo placeholder (uma única vez).
export function handleImageError(event, title) {
  if (event.target.dataset.fallback) return
  event.target.dataset.fallback = 'true'
  event.target.src = placeholderImage(title)
}
