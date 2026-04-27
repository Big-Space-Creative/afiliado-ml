<script setup>
import { onMounted, watch } from 'vue'
import BaseContainer from '@/components/ui/BaseContainer.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import ProductCard from '@/components/functional/ProductCard.vue'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ChevronLeft, ChevronRight, ArrowRight, PackageSearch } from 'lucide-vue-next'
import { useProducts, useProductCarousel } from '@/composables/useProducts'

gsap.registerPlugin(ScrollTrigger)

const { products, isLoading, error } = useProducts({ featured: true, limit: 8 })
const { scrollContainer, scrollLeft, scrollRight } = useProductCarousel()

onMounted(() => {
  if (!isLoading.value && products.value.length > 0) {
    initAnimations()
  }
})

watch(isLoading, (newLoading) => {
  if (!newLoading && products.value.length > 0) {
    setTimeout(() => {
      initAnimations()
    }, 100)
  }
})

function initAnimations() {
  gsap.set('.product-card-wrapper', { autoAlpha: 1, x: 0, filter: 'blur(0px)' })

  gsap.from('.product-card-wrapper', {
    scrollTrigger: {
      trigger: '.products-section',
      start: 'top 80%',
      once: true
    },
    x: 60,
    autoAlpha: 0,
    filter: 'blur(8px)',
    duration: 1,
    stagger: 0.1,
    ease: 'power3.out'
  })
}
</script>

<template>
  <section id="products" class="products-section relative py-20 md:py-28 bg-surface-hover/50 transition-colors duration-300 overflow-hidden">
    <!-- Subtle Background -->
    <div class="absolute -top-1/3 -left-1/4 w-1/2 h-1/2 rounded-full bg-primary/5 blur-3xl pointer-events-none">
    </div>

    <BaseContainer class="relative z-10">
      <!-- Header -->
      <div class="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
        <div>
          <span class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 mb-4">
            <span class="text-xs font-bold text-primary uppercase tracking-wider">Destaques</span>
          </span>
          <h2 class="text-3xl md:text-4xl lg:text-5xl font-bold text-text-main tracking-tight">
            Produtos em Alta
          </h2>
          <p class="text-base text-text-muted mt-2 max-w-md">
            Descubra nossos itens mais populares amados por milhares de clientes.
          </p>
        </div>

        <BaseButton to="/produtos" variant="outline" size="md"
          class="shrink-0 group">
          Ver todos os produtos
          <ArrowRight class="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
        </BaseButton>
      </div>

      <!-- Error State -->
      <div v-if="error" class="bg-red-500/10 border border-red-500/20 rounded-2xl p-8 text-center">
        <p class="text-red-500">{{ error }}</p>
      </div>

      <!-- Loading State -->
      <div v-else-if="isLoading" class="flex gap-5 overflow-hidden pb-6">
        <div v-for="i in 4" :key="i" class="w-64 md:w-72 h-96 bg-surface/40 animate-pulse rounded-2xl border border-border-sutil/50 shrink-0"></div>
      </div>

      <!-- Empty State -->
      <div v-else-if="products.length === 0" class="text-center py-20 bg-surface/20 rounded-2xl border border-dashed border-border-main">
        <PackageSearch class="w-12 h-12 text-text-muted/30 mx-auto mb-4" />
        <p class="text-text-muted">Nenhum produto em destaque encontrado.</p>
      </div>

      <!-- Products Carousel -->
      <div v-else class="relative">
        <!-- Navigation Arrows - Desktop -->
        <button
          class="hidden lg:flex absolute -left-5 top-1/2 -translate-y-1/2 z-20 w-12 h-12 items-center justify-center bg-surface rounded-full shadow-lg border border-border-sutil text-text-muted hover:bg-text-main hover:text-surface hover:border-text-main transition-all duration-300"
          aria-label="Anterior" @click="scrollLeft">
          <ChevronLeft class="w-5 h-5" />
        </button>

        <button
          class="hidden lg:flex absolute -right-5 top-1/2 -translate-y-1/2 z-20 w-12 h-12 items-center justify-center bg-surface rounded-full shadow-lg border border-border-sutil text-text-muted hover:bg-text-main hover:text-surface hover:border-text-main transition-all duration-300"
          aria-label="Próximo" @click="scrollRight">
          <ChevronRight class="w-5 h-5" />
        </button>

        <!-- Cards Container -->
        <div ref="scrollContainer"
          class="flex gap-5 overflow-x-auto pb-6 snap-x snap-mandatory scrollbar-hide -mx-4 px-4 lg:mx-0 lg:px-0">
          <div v-for="product in products" :key="product.id"
            class="product-card-wrapper shrink-0 w-64 md:w-72 snap-start">
            <ProductCard :product="product" />
          </div>
        </div>

        <!-- Navigation Arrows - Mobile -->
        <div class="flex lg:hidden items-center justify-center gap-3 mt-4">
          <button
            class="w-11 h-11 flex items-center justify-center bg-surface border border-border-main rounded-full text-text-muted hover:bg-text-main hover:text-surface transition-all duration-300"
            aria-label="Anterior" @click="scrollLeft">
            <ChevronLeft class="w-5 h-5" />
          </button>
          <button
            class="w-11 h-11 flex items-center justify-center bg-surface border border-border-main rounded-full text-text-muted hover:bg-text-main hover:text-surface transition-all duration-300"
            aria-label="Próximo" @click="scrollRight">
            <ChevronRight class="w-5 h-5" />
          </button>
        </div>
      </div>
    </BaseContainer>
  </section>
</template>

<style scoped>
/* Hide scrollbar */
.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

.scrollbar-hide::-webkit-scrollbar {
  display: none;
}
</style>
