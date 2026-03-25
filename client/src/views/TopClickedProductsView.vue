<script setup>
import { computed, ref } from 'vue'
import BaseContainer from '@/components/ui/BaseContainer.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import ProductCard from '@/components/functional/ProductCard.vue'
import { ArrowLeft, Search, SlidersHorizontal, X } from 'lucide-vue-next'
import { useProducts } from '@/composables/useProducts'
import { useLenis } from '@/composables/useLenis'

const { products } = useProducts()

const searchTerm = ref('')
const selectedCategory = ref('all')
const minPrice = ref('')
const maxPrice = ref('')

const categories = computed(() => {
  const values = products.value
    .map((product) => product.variant)
    .filter(Boolean)
  return Array.from(new Set(values)).sort((a, b) => a.localeCompare(b))
})

const filteredProducts = computed(() => {
  const normalizedSearch = searchTerm.value.trim().toLowerCase()
  const min = Number(minPrice.value)
  const max = Number(maxPrice.value)

  return [...products.value]
    .filter((product) => {
      if (normalizedSearch && !product.name.toLowerCase().includes(normalizedSearch)) return false
      if (selectedCategory.value !== 'all' && product.variant !== selectedCategory.value) return false
      if (!Number.isNaN(min) && minPrice.value !== '' && product.price < min) return false
      if (!Number.isNaN(max) && maxPrice.value !== '' && product.price > max) return false
      return true
    })
    .sort((a, b) => Number(b.clickCount || 0) - Number(a.clickCount || 0))
})

const clearFilters = () => {
  searchTerm.value = ''
  selectedCategory.value = 'all'
  minPrice.value = ''
  maxPrice.value = ''
}

useLenis({
  lerp: 0.08,
  duration: 1.4,
  smoothWheel: true,
  smoothTouch: false
})
</script>

<template>
  <section class="relative py-16 md:py-20 bg-gray-50/60 overflow-hidden">
    <div class="absolute -top-1/3 -left-1/4 w-1/2 h-1/2 rounded-full bg-blue-100/30 blur-3xl pointer-events-none"></div>

    <BaseContainer class="relative z-10">
      <div class="flex flex-col gap-6 md:flex-row md:items-end md:justify-between mb-10 md:mb-12">
        <div class="max-w-2xl">
          <span class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 mb-4">
            <span class="text-xs font-bold text-blue-600 uppercase tracking-wider">Ranking</span>
          </span>
          <h1 class="text-3xl md:text-5xl font-bold text-gray-950 tracking-tight leading-tight">
            Produtos Mais Clicados
          </h1>
          <p class="mt-3 text-gray-600">
            Encontre os produtos com maior volume de cliques e aplique filtros para descobrir oportunidades.
          </p>
        </div>

        <BaseButton to="/" variant="outline" size="md" class="group">
          <ArrowLeft class="w-4 h-4 mr-2 transition-transform group-hover:-translate-x-1" />
          Voltar para home
        </BaseButton>
      </div>

      <div class="bg-white border border-gray-200 rounded-2xl p-4 md:p-5 mb-8 shadow-sm">
        <div class="flex items-center gap-2 mb-4 text-gray-700">
          <SlidersHorizontal class="w-4 h-4" />
          <span class="text-sm font-semibold">Filtros</span>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-4 gap-3">
          <label class="relative md:col-span-2">
            <Search class="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              v-model="searchTerm"
              type="text"
              placeholder="Buscar por nome do produto"
              class="w-full h-11 pl-10 pr-3 rounded-xl border border-gray-200 bg-white text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-blue-500"
            />
          </label>

          <select
            v-model="selectedCategory"
            class="w-full h-11 px-3 rounded-xl border border-gray-200 bg-white text-sm text-gray-900 focus:outline-none focus:border-blue-500"
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
              placeholder="Min $"
              class="w-full h-11 px-3 rounded-xl border border-gray-200 bg-white text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-blue-500"
            />
            <input
              v-model="maxPrice"
              type="number"
              min="0"
              placeholder="Max $"
              class="w-full h-11 px-3 rounded-xl border border-gray-200 bg-white text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-blue-500"
            />
          </div>
        </div>

        <div class="mt-4 flex items-center justify-between gap-3">
          <p class="text-xs text-gray-500">
            {{ filteredProducts.length }} produto(s) encontrado(s)
          </p>

          <button
            type="button"
            class="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-600 hover:text-gray-950 transition-colors"
            @click="clearFilters"
          >
            <X class="w-3.5 h-3.5" />
            Limpar filtros
          </button>
        </div>
      </div>

      <div v-if="filteredProducts.length" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        <div
          v-for="product in filteredProducts"
          :key="product.id"
          class="relative"
        >
          <span class="absolute top-3 left-3 z-10 inline-flex items-center rounded-full bg-gray-950/90 text-white text-xs font-bold px-2.5 py-1">
            {{ Number(product.clickCount || 0).toLocaleString('pt-BR') }} cliques
          </span>
          <ProductCard :product="product" />
        </div>
      </div>

      <div v-else class="rounded-2xl border border-dashed border-gray-300 bg-white/70 p-10 text-center">
        <p class="text-gray-700 font-medium">Nenhum produto encontrado com os filtros atuais.</p>
        <p class="text-sm text-gray-500 mt-1">Tente ajustar o nome, categoria ou faixa de preco.</p>
      </div>
    </BaseContainer>
  </section>
</template>
