<script setup>
import { ref, computed } from 'vue'
import BaseContainer from '@/components/ui/BaseContainer.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import CategoryCard from '@/components/functional/CategoryCard.vue'
import { ArrowLeft, Search, X, FolderTree } from 'lucide-vue-next'
import { useCategories } from '@/composables/useCategories'
import { useLenis } from '@/composables/useLenis'

const { categories, isLoading } = useCategories()
const searchTerm = ref('')

const filteredCategories = computed(() => {
  if (!searchTerm.value.trim()) return categories.value
  const term = searchTerm.value.toLowerCase()
  return categories.value.filter(cat => 
    cat.name.toLowerCase().includes(term) || 
    (cat.desc && cat.desc.toLowerCase().includes(term))
  )
})

const clearSearch = () => {
  searchTerm.value = ''
}

useLenis({
  lerp: 0.08,
  duration: 1.4,
  smoothWheel: true,
  smoothTouch: false
})
</script>

<template>
  <section class="relative py-16 md:py-20 bg-surface-hover/60 transition-colors duration-300 min-h-screen overflow-hidden">
    <!-- Glows -->
    <div class="absolute top-0 right-0 w-120 h-120 rounded-full bg-primary/10 blur-[100px] pointer-events-none -translate-y-1/2 translate-x-1/4"></div>
    <div class="absolute bottom-0 left-0 w-96 h-96 rounded-full bg-indigo-500/10 blur-[90px] pointer-events-none translate-y-1/2 -translate-x-1/4"></div>

    <BaseContainer class="relative z-10">
      <!-- Header -->
      <div class="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between mb-10 md:mb-12">
        <div class="max-w-2xl">
          <span class="inline-block px-3 py-1 rounded-full bg-surface border border-border-sutil text-xs font-bold text-text-muted uppercase tracking-wider mb-4 shadow-sm">
            Catálogo
          </span>
          <h1 class="text-3xl md:text-5xl font-bold text-text-main tracking-tight leading-tight">
            Nossas <span class="text-transparent bg-clip-text bg-linear-to-r from-primary to-indigo-600">Categorias</span>
          </h1>
          <p class="mt-3 text-text-muted">
            Explore nossa seleção curada organizada por categorias para encontrar exatamente o que você precisa.
          </p>
        </div>

        <BaseButton to="/" variant="outline" size="md" class="group w-fit">
          <ArrowLeft class="w-4 h-4 mr-2 transition-transform group-hover:-translate-x-1" />
          Voltar para Início
        </BaseButton>
      </div>

      <!-- Search Bar -->
      <div class="max-w-md mb-10">
        <div class="relative group">
          <Search class="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted group-focus-within:text-primary transition-colors" />
          <input 
            v-model="searchTerm"
            type="text" 
            placeholder="Buscar por categoria..."
            class="w-full h-14 pl-12 pr-12 rounded-2xl bg-surface border border-border-sutil text-text-main placeholder:text-text-muted/50 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all shadow-sm"
          />
          <button 
            v-if="searchTerm"
            @click="clearSearch"
            class="absolute right-4 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-surface-hover text-text-muted transition-colors"
          >
            <X class="w-4 h-4" />
          </button>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="isLoading" class="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 auto-rows-[300px] md:auto-rows-[340px]">
        <div v-for="i in 6" :key="i" class="rounded-4xl bg-surface/40 animate-pulse border border-border-sutil/50" :class="i % 4 === 1 ? 'md:col-span-2' : ''"></div>
      </div>

      <!-- Grid de Categorias -->
      <div v-else-if="filteredCategories.length > 0" class="grid grid-cols-1 md:grid-cols-3 grid-flow-row-dense gap-4 md:gap-6 auto-rows-[300px] md:auto-rows-[340px]">
        <CategoryCard
          v-for="(category, index) in filteredCategories"
          :key="category.id"
          :category="category"
          :index="index"
          :featured="index % 4 === 0 || index % 4 === 3"
        />
      </div>

      <!-- Empty State -->
      <div v-else class="rounded-3xl border border-dashed border-border-main bg-surface/50 p-16 text-center">
        <div class="w-20 h-20 bg-surface-hover rounded-full flex items-center justify-center mx-auto mb-6">
          <FolderTree class="w-10 h-10 text-text-muted/30" />
        </div>
        <p class="text-text-main font-bold text-xl">Nenhuma categoria encontrada</p>
        <p class="text-text-muted mt-2 max-w-sm mx-auto">Não encontramos categorias correspondentes à sua busca "{{ searchTerm }}".</p>
        <BaseButton variant="outline" size="md" class="mt-8" @click="clearSearch">
          Ver todas as categorias
        </BaseButton>
      </div>
    </BaseContainer>
  </section>
</template>
