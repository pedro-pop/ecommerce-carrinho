import { describe, it, expect, vi, afterEach } from 'vitest'
import { fetchProducts, normalizeProduct, COTACAO_DEMO } from '../src/services/productService'

afterEach(() => vi.unstubAllGlobals())

const resposta = (body, ok = true, status = 200) => ({ ok, status, json: async () => body })

describe('productService', () => {
  it('normaliza o produto e converte o preço', () => {
    const p = normalizeProduct({ id: 5, title: 'X', price: 10, category: 'sunglasses', thumbnail: 't.png' })
    expect(p.price).toBe(10 * COTACAO_DEMO)
    expect(p.images).toEqual([])
    expect(p.description).toBe('')
  })

  it('filtra apenas as categorias da loja', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(resposta({
      products: [
        { id: 1, title: 'A', price: 1, category: 'fragrances' },
        { id: 2, title: 'B', price: 1, category: 'groceries' },
      ],
    })))
    const lista = await fetchProducts()
    expect(lista.map((p) => p.id)).toEqual([1])
  })

  it('lança erro quando a API responde com status de falha', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(resposta({}, false, 500)))
    await expect(fetchProducts()).rejects.toThrow('status 500')
  })

  it('lança erro quando a resposta tem formato inesperado', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(resposta({ foo: 'bar' })))
    await expect(fetchProducts()).rejects.toThrow('formato inesperado')
  })
})
