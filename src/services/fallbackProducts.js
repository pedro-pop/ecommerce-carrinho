// Dados LOCAIS, usados somente quando a API pública está indisponível.
// A interface avisa o usuário quando estes dados estão em uso.
// Ilustrações simples (SVG) por categoria: os dados locais não têm fotos reais.
const INK = '#171717'
const desenhos = {
  watch: `<rect x="165" y="40" width="70" height="95" fill="${INK}"/><rect x="165" y="265" width="70" height="95" fill="${INK}"/><circle cx="200" cy="200" r="85" fill="#fff" stroke="${INK}" stroke-width="8"/><path d="M200 200v-55M200 200l38 22" stroke="${INK}" stroke-width="7" stroke-linecap="round"/>`,
  sunglasses: `<rect x="45" y="160" width="135" height="95" rx="32" fill="${INK}"/><rect x="220" y="160" width="135" height="95" rx="32" fill="${INK}"/><path d="M180 190q20-14 40 0M45 175l-22-25M355 175l22-25" stroke="${INK}" stroke-width="8" fill="none" stroke-linecap="round"/>`,
  shoe: `<path d="M50 250V165q80 20 130-30l40 32q40 32 120 48 20 8 20 35z" fill="#fff" stroke="${INK}" stroke-width="8" stroke-linejoin="round"/><rect x="45" y="250" width="330" height="28" rx="8" fill="${INK}"/><path d="M185 165l25 20M205 150l25 20" stroke="${INK}" stroke-width="7" stroke-linecap="round"/>`,
  bag: `<path d="M140 150v-30a60 60 0 0 1 120 0v30" stroke="${INK}" stroke-width="9" fill="none"/><path d="M90 150h220l24 195H66z" fill="${INK}"/><rect x="178" y="205" width="44" height="14" fill="#fff"/>`,
  fragrance: `<rect x="185" y="55" width="30" height="40" fill="${INK}"/><rect x="170" y="95" width="60" height="55" fill="${INK}"/><rect x="130" y="150" width="140" height="195" rx="10" fill="#fff" stroke="${INK}" stroke-width="8"/><rect x="160" y="215" width="80" height="60" fill="${INK}"/>`,
  shirt: `<path d="M140 70l-92 52 36 56 36-20v162h160V158l36 20 36-56-92-52q-26 32-60 32t-60-32z" fill="#fff" stroke="${INK}" stroke-width="8" stroke-linejoin="round"/><path d="M170 78q30 34 60 0" stroke="${INK}" stroke-width="8" fill="none"/>`,
}
const tipoPorCategoria = {
  'mens-watches': 'watch', 'womens-watches': 'watch', sunglasses: 'sunglasses',
  'mens-shoes': 'shoe', 'womens-shoes': 'shoe', 'womens-bags': 'bag',
  fragrances: 'fragrance', 'mens-shirts': 'shirt',
}

function ilustracao(category) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400"><rect width="400" height="400" fill="#F2F2F2"/>${desenhos[tipoPorCategoria[category]]}</svg>`
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`
}

const base = { images: [], brand: 'NOIR Studio', stock: 20 }

const produtosLocais = [
  { ...base, id: 1001, title: 'Relógio Essential Preto', category: 'mens-watches', price: 1290, rating: 4.7, description: 'Relógio analógico com caixa em aço escovado e pulseira de couro preto. Resistente à água até 50 metros.' },
  { ...base, id: 1002, title: 'Relógio Linha Fina', category: 'womens-watches', price: 990, rating: 4.5, description: 'Design minimalista com mostrador branco e pulseira em malha de aço. Leve e discreto para o dia a dia.' },
  { ...base, id: 1003, title: 'Óculos Monolith', category: 'sunglasses', price: 480, rating: 4.4, description: 'Armação em acetato preto com lentes escuras e proteção UV400.' },
  { ...base, id: 1004, title: 'Tênis Urban Mono', category: 'mens-shoes', price: 720, rating: 4.6, description: 'Tênis de couro liso com solado de borracha. Conforto para longas caminhadas.' },
  { ...base, id: 1005, title: 'Sapatilha Slate', category: 'womens-shoes', price: 560, rating: 4.3, description: 'Sapatilha em couro macio com palmilha anatômica e acabamento limpo.' },
  { ...base, id: 1006, title: 'Bolsa Structure', category: 'womens-bags', price: 1150, rating: 4.8, description: 'Bolsa estruturada com forro interno e fecho magnético. Cabe notebook de 13 polegadas.' },
  { ...base, id: 1007, title: 'Perfume Noir Absolu', category: 'fragrances', price: 640, rating: 4.9, description: 'Fragrância amadeirada com notas de cedro e baunilha. Frasco de 100 ml.' },
  { ...base, id: 1008, title: 'Camisa Oxford Branca', category: 'mens-shirts', price: 390, rating: 4.2, description: 'Camisa de algodão com corte reto e colarinho clássico.' },
]

export const fallbackProducts = produtosLocais.map((p) => ({ ...p, thumbnail: ilustracao(p.category) }))
