<script setup>
import { onMounted, watch } from 'vue'
import BaseContainer from '@/components/ui/BaseContainer.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import CategoryCard from './CategoryCard.vue'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ArrowRight, FolderTree } from 'lucide-vue-next'
import { useCategories } from '@/composables/useCategories'

gsap.registerPlugin(ScrollTrigger)

const { categories, isLoading } = useCategories({ onlyParents: true })

onMounted(() => {
  // Somente anima se não estiver carregando ou após o carregamento
  if (!isLoading.value) {
    initAnimations()
  }
})

// Reinicia animações quando as categorias são carregadas
watch(isLoading, (newLoading) => {
  if (!newLoading && categories.value.length > 0) {
    // Timeout pequeno para garantir que o DOM renderizou os cards
    setTimeout(() => {
      initAnimations()
    }, 100)
  }
})

function initAnimations() {
  gsap.set('.bento-card', { autoAlpha: 0, y: 40, scale: 0.95 })

  gsap.to('.bento-card', {
    scrollTrigger: {
      trigger: '.categories-section',
      start: 'top 80%',
      once: true
    },
    y: 0,
    autoAlpha: 1,
    scale: 1,
    duration: 0.8,
    stagger: 0.1,
    ease: 'expo.out'
  })
}
</script>

<template>
  <section id="categories" class="categories-section relative py-20 md:py-32 bg-surface-hover/50 transition-colors duration-300 overflow-hidden">
    <!-- Background Glows -->
    <div class="absolute top-0 right-0 w-150 h-150 rounded-full bg-primary/10 blur-[120px] pointer-events-none -translate-y-1/2 translate-x-1/3"></div>
    <div class="absolute bottom-0 left-0 w-125 h-125 rounded-full bg-indigo-500/10 blur-[120px] pointer-events-none translate-y-1/3 -translate-x-1/4"></div>

    <BaseContainer class="relative z-10">
      <!-- Section Header -->
      <div class="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 md:mb-16">
        <div class="max-w-2xl">
          <span class="inline-block px-3 py-1 rounded-full bg-surface border border-border-sutil text-xs font-bold text-text-muted uppercase tracking-wider mb-4 shadow-sm">
            Explorar
          </span>
          <h2 class="text-3xl md:text-5xl font-bold text-text-main tracking-tight leading-tight">
            Navegue por <br class="hidden md:block" />
            <span class="text-transparent bg-clip-text bg-linear-to-r from-primary to-indigo-600">Categorias em Destaque</span>
          </h2>
        </div>

        <BaseButton to="/categorias" variant="outline" size="md" class="shrink-0 group">
          Ver todas as categorias
          <ArrowRight class="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
        </BaseButton>
      </div>

      <!-- Loading State -->
      <div v-if="isLoading" class="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 auto-rows-[300px] md:auto-rows-[340px]">
        <div v-for="i in 3" :key="i" class="rounded-4xl bg-surface/40 animate-pulse border border-border-sutil/50" :class="i === 1 ? 'md:col-span-2' : ''"></div>
      </div>

      <!-- Empty State -->
      <div v-else-if="categories.length === 0" class="text-center py-20 bg-surface/20 rounded-4xl border border-dashed border-border-main transition-colors duration-300">
        <div class="w-16 h-16 bg-surface-hover rounded-full flex items-center justify-center mx-auto mb-4">
          <FolderTree class="w-8 h-8 text-text-muted/30" />
        </div>
        <p class="text-text-muted font-medium">Nenhuma categoria principal cadastrada ainda.</p>
      </div>

      <!-- Bento Grid -->
      <div v-else class="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 auto-rows-[300px] md:auto-rows-[340px]">
        <CategoryCard
          v-for="(category, index) in categories.slice(0, 4)"
          :key="category.id"
          :category="category"
          :index="index"
          :featured="index % 4 === 0 || index % 4 === 3"
        />
      </div>
    </BaseContainer>
  </section>
</template>
