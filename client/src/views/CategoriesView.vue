<script setup>
import BaseContainer from '@/components/ui/BaseContainer.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import CategoryCard from '@/components/functional/CategoryCard.vue'
import { ArrowLeft } from 'lucide-vue-next'
import { useCategories } from '@/composables/useCategories'
import { useLenis } from '@/composables/useLenis'

const { categories } = useCategories()

useLenis({
  lerp: 0.08,
  duration: 1.4,
  smoothWheel: true,
  smoothTouch: false
})
</script>

<template>
  <section class="relative py-16 md:py-20 bg-slate-50/60 overflow-hidden">
    <div class="absolute top-0 right-0 w-120 h-120 rounded-full bg-blue-300/20 blur-[100px] pointer-events-none -translate-y-1/2 translate-x-1/4"></div>
    <div class="absolute bottom-0 left-0 w-96 h-96 rounded-full bg-indigo-300/20 blur-[90px] pointer-events-none translate-y-1/2 -translate-x-1/4"></div>

    <BaseContainer class="relative z-10">
      <div class="flex flex-col gap-6 md:flex-row md:items-end md:justify-between mb-10 md:mb-12">
        <div class="max-w-2xl">
          <span class="inline-block px-3 py-1 rounded-full bg-white border border-slate-200 text-xs font-bold text-slate-500 uppercase tracking-wider mb-4 shadow-sm">
            Catálogo
          </span>
          <h1 class="text-3xl md:text-5xl font-bold text-slate-900 tracking-tight leading-tight">
            Todas as <span class="text-transparent bg-clip-text bg-linear-to-r from-blue-600 to-indigo-600">Categorias</span>
          </h1>
          <p class="mt-3 text-slate-600">
            Explore as categorias disponíveis para encontrar os produtos com mais rapidez.
          </p>
        </div>

        <BaseButton to="/" variant="outline" size="md" class="group">
          <ArrowLeft class="w-4 h-4 mr-2 transition-transform group-hover:-translate-x-1" />
          Voltar para home
        </BaseButton>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 grid-flow-row-dense gap-4 md:gap-6 auto-rows-[300px] md:auto-rows-[340px]">
        <CategoryCard
          v-for="(category, index) in categories"
          :key="category.id"
          :category="category"
          :index="index"
          :featured="index % 4 === 0 || index % 4 === 3"
        />
      </div>
    </BaseContainer>
  </section>
</template>
