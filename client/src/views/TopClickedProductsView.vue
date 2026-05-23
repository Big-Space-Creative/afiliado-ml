<script setup>
import { computed, ref } from 'vue'
import BaseContainer from '@/components/ui/BaseContainer.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import ProductCard from '@/components/functional/ProductCard.vue'
import { ArrowLeft, Search, X, ArrowUpDown } from 'lucide-vue-next'
import { useProducts } from '@/composables/useProducts'
import { useLenis } from '@/composables/useLenis'

const { products, isLoading } = useProducts()

const searchTerm = ref('')
const selectedCategory = ref('all')
const minPrice = ref('')
const maxPrice = ref('')
const sortBy = ref('popular') // popular, price_asc, price_desc, newest

const categories = computed(() => {
  const values = products.value
    .map((product) => product.variant)
    .filter(Boolean)
  return Array.from(new Set(values)).sort((a, b) => a.localeCompare(b))
})

const parsePrice = (priceStr) => {
  if (!priceStr) return 0
  // Remove pontos de milhar e troca vírgula por ponto para conversão numérica
  return Number(priceStr.replace(/\./g, '').replace(',', '.'))
}

const filteredProducts = computed(() => {
  const normalizedSearch = searchTerm.value.trim().toLowerCase()
  const min = Number(minPrice.value)
  const max = Number(maxPrice.value)

  let result = [...products.value].filter((product) => {
    const numericPrice = parsePrice(product.price)
    if (normalizedSearch && !product.name.toLowerCase().includes(normalizedSearch)) return false
    if (selectedCategory.value !== 'all' && product.variant !== selectedCategory.value) return false
    if (!Number.isNaN(min) && minPrice.value !== '' && numericPrice < min) return false
    if (!Number.isNaN(max) && maxPrice.value !== '' && numericPrice > max) return false
    return true
  })

  // Ordenação
  result.sort((a, b) => {
    if (sortBy.value === 'popular') {
      return (b.clickCount || 0) - (a.clickCount || 0)
    }
    if (sortBy.value === 'price_asc') {
      return parsePrice(a.price) - parsePrice(b.price)
    }
    if (sortBy.value === 'price_desc') {
      return parsePrice(b.price) - parsePrice(a.price)
    }
    if (sortBy.value === 'newest') {
      return b.id - a.id // Fallback se não houver data, assume maior ID como mais novo
    }
    return 0
  })

  return result
})

const clearFilters = () => {
  searchTerm.value = ''
  selectedCategory.value = 'all'
  minPrice.value = ''
  maxPrice.value = ''
  sortBy.value = 'popular'
}

useLenis({
  lerp: 0.08,
  duration: 1.4,
  smoothWheel: true,
  smoothTouch: false
})
</script>

<template>
  <section class="relative py-16 md:py-20 bg-surface-hover/60 transition-colors duration-300 overflow-hidden">
    <div class="absolute -top-1/3 -left-1/4 w-1/2 h-1/2 rounded-full bg-primary/10 blur-3xl pointer-events-none"></div>

    <BaseContainer class="relative z-10">
      <div class="flex flex-col gap-6 md:flex-row md:items-end md:justify-between mb-10 md:mb-12">
        <div class="max-w-2xl">
          <span class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 mb-4">
            <span class="text-xs font-bold text-primary uppercase tracking-wider">Vitrine</span>
          </span>
          <h1 class="text-3xl md:text-5xl font-bold text-text-main tracking-tight leading-tight">
            Nosso Catálogo
          </h1>
          <p class="mt-3 text-text-muted">
            Explore nossa curadoria de produtos premium verificados. Use os filtros para encontrar o que você busca.
          </p>
        </div>

        <BaseButton to="/" variant="outline" size="md" class="group">
          <ArrowLeft class="w-4 h-4 mr-2 transition-transform group-hover:-translate-x-1" />
          Voltar para Início
        </BaseButton>
      </div>

      <!-- Toolbar de Filtros -->
      <div class="bg-surface border border-border-sutil rounded-2xl p-4 md:p-5 mb-8 shadow-sm transition-colors duration-300">
        <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          
          <!-- Filtros Principais -->
          <div class="grid grid-cols-1 md:grid-cols-3 gap-3 flex-1">
            <label class="relative md:col-span-1">
              <Search class="w-4 h-4 text-text-muted absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                v-model="searchTerm"
                type="text"
                placeholder="Buscar produto..."
                class="w-full h-11 pl-10 pr-3 rounded-xl border border-border-main bg-surface-hover text-sm text-text-main placeholder:text-text-muted/50 focus:outline-none focus:border-primary transition-colors"
              />
            </label>

            <select
              v-model="selectedCategory"
              class="w-full h-11 px-3 rounded-xl border border-border-main bg-surface-hover text-sm text-text-main focus:outline-none focus:border-primary transition-colors cursor-pointer"
            >
              <option value="all">Todas as categorias</option>
              <option v-for="category in categories" :key="category" :value="category">
                {{ category }}
              </option>
            </select>

            <div class="grid grid-cols-2 gap-3">
              <input
                v-model="minPrice"
                type="number"
                min="0"
                placeholder="Preço Mín"
                class="w-full h-11 px-3 rounded-xl border border-border-main bg-surface-hover text-sm text-text-main placeholder:text-text-muted/50 focus:outline-none focus:border-primary transition-colors"
              />
              <input
                v-model="maxPrice"
                type="number"
                min="0"
                placeholder="Preço Máx"
                class="w-full h-11 px-3 rounded-xl border border-border-main bg-surface-hover text-sm text-text-main placeholder:text-text-muted/50 focus:outline-none focus:border-primary transition-colors"
              />
            </div>
          </div>

          <!-- Ordenação -->
          <div class="flex items-center gap-3 border-t lg:border-t-0 lg:border-l border-border-sutil pt-4 lg:pt-0 lg:pl-6">
            <div class="flex items-center gap-2 text-text-muted shrink-0">
              <ArrowUpDown class="w-4 h-4" />
              <span class="text-xs font-semibold uppercase tracking-wider">Ordenar por:</span>
            </div>
            <select
              v-model="sortBy"
              class="h-11 px-3 rounded-xl border border-border-main bg-surface-hover text-sm text-text-main focus:outline-none focus:border-primary transition-colors cursor-pointer min-w-40"
            >
              <option value="popular">Mais Populares</option>
              <option value="price_asc">Menor Preço</option>
              <option value="price_desc">Maior Preço</option>
              <option value="newest">Lançamentos</option>
            </select>
          </div>
        </div>

        <!-- Meta Info -->
        <div class="mt-4 pt-4 border-t border-border-sutil flex items-center justify-between gap-3">
          <p class="text-xs text-text-muted font-medium">
            Mostrando {{ filteredProducts.length }} de {{ products.length }} produtos
          </p>

          <button
            v-if="searchTerm || selectedCategory !== 'all' || minPrice || maxPrice || sortBy !== 'popular'"
            type="button"
            class="inline-flex items-center gap-1.5 text-xs font-bold text-primary hover:text-primary-dark transition-colors"
            @click="clearFilters"
          >
            <X class="w-3.5 h-3.5" />
            Limpar todos os filtros
          </button>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="isLoading" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
        <div v-for="i in 6" :key="i" class="h-100 rounded-2xl bg-surface/40 animate-pulse border border-border-sutil/50"></div>
      </div>

      <!-- Grid de Produtos -->
      <div v-else-if="filteredProducts.length" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
        <div
          v-for="product in filteredProducts"
          :key="product.id"
          class="relative group"
        >
          <!-- Ranking Badge (Opcional, apenas se for Popular) -->
          <div v-if="sortBy === 'popular' && filteredProducts.indexOf(product) < 3" 
               class="absolute -top-2 -left-2 z-20 w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center text-xs font-bold shadow-lg shadow-primary/30 border-2 border-surface">
            {{ filteredProducts.indexOf(product) + 1 }}
          </div>
          <ProductCard :product="product" />
        </div>
      </div>

      <!-- Empty State -->
      <div v-else class="rounded-3xl border border-dashed border-border-main bg-surface/50 p-16 text-center">
        <div class="w-20 h-20 bg-surface-hover rounded-full flex items-center justify-center mx-auto mb-6">
          <Search class="w-10 h-10 text-text-muted/30" />
        </div>
        <p class="text-text-main font-bold text-xl">Nenhum produto encontrado</p>
        <p class="text-text-muted mt-2 max-w-sm mx-auto">Não encontramos resultados para os filtros aplicados. Tente ajustar sua busca ou limpar os filtros.</p>
        <BaseButton variant="outline" size="md" class="mt-8" @click="clearFilters">
          Limpar Filtros
        </BaseButton>
      </div>
    </BaseContainer>
  </section>
</template>
