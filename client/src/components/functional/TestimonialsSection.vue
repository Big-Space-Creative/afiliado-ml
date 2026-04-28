<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import BaseContainer from '@/components/ui/BaseContainer.vue'
import TestimonialCard from '@/components/functional/TestimonialCard.vue'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useTestimonials } from '@/composables/useTestimonials'
import { useScrollVelocity } from '@/composables/useScrollVelocity'

gsap.registerPlugin(ScrollTrigger)

const { infiniteList } = useTestimonials()

// Refs para os elementos DOM
const row1Ref = ref(null)
const row2Ref = ref(null)

// Inicializa animações de scroll velocity
useScrollVelocity(row1Ref, {
  baseVelocity: 50,
  direction: 'left',
  triggerSelector: '.testimonial-section'
})

useScrollVelocity(row2Ref, {
  baseVelocity: 50,
  direction: 'right',
  triggerSelector: '.testimonial-section'
})

let revealTween = null

onMounted(() => {
  // Reveal Section
  gsap.set('.testimonial-section-container', { autoAlpha: 1, y: 0, filter: 'blur(0px)' })
  revealTween = gsap.from('.testimonial-section-container', {
    scrollTrigger: {
      trigger: '.testimonial-section',
      start: 'top 85%',
      once: true
    },
    y: 50,
    autoAlpha: 0,
    filter: 'blur(8px)',
    duration: 1,
    ease: 'power3.out'
  })
})

onUnmounted(() => {
  revealTween?.kill()
})
</script>

<template>
  <section id="testimonials" class="testimonial-section relative py-20 md:py-28 bg-surface-hover transition-colors duration-300 overflow-hidden">
    <!-- Subtle Background -->
    <div class="absolute -top-1/4 left-1/4 w-1/2 h-1/2 rounded-full bg-primary/5 blur-3xl pointer-events-none">
    </div>
    <div class="absolute -bottom-1/4 right-1/4 w-1/3 h-1/3 rounded-full bg-surface/30 blur-3xl pointer-events-none">
    </div>

    <BaseContainer class="testimonial-section-container mb-12">
      <!-- Section Header -->
      <div class="text-center max-w-2xl mx-auto">
        <span class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 mb-4">
          <span class="text-xs font-bold text-primary uppercase tracking-wider">Depoimentos</span>
        </span>
        <h2 class="text-3xl md:text-4xl lg:text-5xl font-bold text-text-main tracking-tight mb-4">
          Amado por milhares
        </h2>
        <p class="text-base md:text-lg text-text-muted">
          Veja o que nossos clientes estão dizendo sobre sua experiência conosco.
        </p>
      </div>
    </BaseContainer>

    <!-- Marquee Container -->
    <div class="relative w-full flex flex-col gap-6 md:gap-8">
      <!-- Fade Edges -->
      <div
        class="absolute inset-y-0 left-0 w-24 md:w-40 bg-linear-to-r from-surface-hover to-transparent z-10 pointer-events-none">
      </div>
      <div
        class="absolute inset-y-0 right-0 w-24 md:w-40 bg-linear-to-l from-surface-hover to-transparent z-10 pointer-events-none">
      </div>

      <!-- Row 1: Left -->
      <div ref="row1Ref" class="flex w-max gap-5 px-6 will-change-transform">
        <div v-for="(t, index) in infiniteList" :key="`row1-${index}`" class="w-80 md:w-96 shrink-0">
          <TestimonialCard :testimonial="t" />
        </div>
      </div>

      <!-- Row 2: Right (Reverse) -->
      <div ref="row2Ref" class="flex w-max gap-5 px-6 will-change-transform">
        <div v-for="(t, index) in infiniteList" :key="`row2-${index}`" class="w-80 md:w-96 shrink-0">
          <TestimonialCard :testimonial="t" />
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
/* Animation is handled by useScrollVelocity composable */
</style>
