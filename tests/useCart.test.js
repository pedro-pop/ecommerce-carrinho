import { describe, it, expect, beforeEach } from 'vitest'
import { nextTick } from 'vue'
import { useCart } from '../src/composables/useCart'

const relogio = { id: 1, title: 'Relógio', price: 100, category: 'mens-watches', thumbnail: '', images: [] }
const perfume = { id: 2, title: 'Perfume', price: 250, category: 'fragrances', thumbnail: '', images: [] }

describe('useCart', () => {
  let cart
  beforeEach(() => {
    cart = useCart()
    cart.clear()
  })

  it('adiciona produto e soma quantidades do mesmo produto', () => {
    cart.addItem(relogio, 1)
    cart.addItem(relogio, 2)
    expect(cart.items.value).toHaveLength(1)
    expect(cart.items.value[0].quantity).toBe(3)
  })

  it('calcula subtotal, total de itens e frete', () => {
    cart.addItem(relogio, 2) // 200
    cart.addItem(perfume, 1) // 250 -> subtotal 450 (< 500, paga frete)
    expect(cart.totalItems.value).toBe(3)
    expect(cart.subtotal.value).toBe(450)
    expect(cart.shipping.value).toBe(29.9)
    expect(cart.total.value).toBeCloseTo(479.9)
  })

  it('dá frete grátis a partir de R$ 500', () => {
    cart.addItem(perfume, 2)
    expect(cart.subtotal.value).toBe(500)
    expect(cart.shipping.value).toBe(0)
  })

  it('limita a quantidade entre 1 e 10', () => {
    cart.addItem(relogio, 1)
    cart.setQuantity(1, 99)
    expect(cart.items.value[0].quantity).toBe(10)
    cart.setQuantity(1, 0)
    expect(cart.items.value[0].quantity).toBe(1)
  })

  it('remove produto e esvazia o carrinho', () => {
    cart.addItem(relogio)
    cart.addItem(perfume)
    cart.removeItem(1)
    expect(cart.items.value.map((i) => i.id)).toEqual([2])
    cart.clear()
    expect(cart.totalItems.value).toBe(0)
    expect(cart.shipping.value).toBe(0)
  })

  it('grava o carrinho no localStorage', async () => {
    cart.addItem(relogio, 2)
    await nextTick()
    const saved = JSON.parse(localStorage.getItem('noir-cart'))
    expect(saved[0]).toMatchObject({ id: 1, quantity: 2 })
  })
})
