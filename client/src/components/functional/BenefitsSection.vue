<script setup>
import { onMounted, onUnmounted } from 'vue'
import BaseContainer from '@/components/ui/BaseContainer.vue'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useBenefits } from '@/composables/useBenefits'
import { useTiltCard } from '@/composables/useTiltCard'

gsap.registerPlugin(ScrollTrigger)

const { benefits, iconComponents } = useBenefits()

// Criar instâncias de tilt para cada card
const tiltCards = benefits.map(() => useTiltCard({
  rotateAmplitude: 10,
  scaleOnHover: 1.03,
  transitionDuration: 0.3
}))

let entranceTween = null

onMounted(() => {
  // Garante que os cards estejam visíveis inicialmente
  gsap.set('.benefit-card', { autoAlpha: 1, y: 0, filter: 'blur(0px)' })

  entranceTween = gsap.from('.benefit-card', {
    scrollTrigger: {
      trigger: '.benefits-grid',
      start: 'top 85%',
      once: true
    },
    y: 40,
    autoAlpha: 0,
    filter: 'blur(6px)',
    duration: 0.8,
    stagger: 0.12,
    ease: 'power3.out'
  })
})

onUnmounted(() => {
  entranceTween?.kill()
})
</script>

<template>
  <section id="benefits" class="relative py-20 md:py-28 bg-surface overflow-hidden transition-colors duration-300">
    <!-- Subtle Background Elements -->
    <div class="absolute -top-1/4 -right-1/4 w-1/2 h-1/2 rounded-full bg-primary/5 blur-3xl pointer-events-none">
    </div>
    <div class="absolute -bottom-1/4 -left-1/4 w-1/3 h-1/3 rounded-full bg-surface-hover/50 blur-3xl pointer-events-none">
    </div>

    <BaseContainer class="relative z-10">
      <!-- Section Header -->
      <div class="text-center mb-16">
        <span class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 mb-4">
          <span class="text-xs font-bold text-primary uppercase tracking-wider">Por que nos escolher</span>
        </span>
        <h2 class="text-3xl md:text-4xl lg:text-5xl font-bold text-text-main tracking-tight">
          Benefícios de comprar conosco
        </h2>
      </div>

      <!-- Benefits Grid -->
      <div class="benefits-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
        <div v-for="(benefit, index) in benefits" :key="benefit.title"
          :ref="el => { if (el) tiltCards[index].elementRef.value = el }" :style="tiltCards[index].style.value"
          @mousemove="tiltCards[index].onMouseMove" @mouseenter="tiltCards[index].onMouseEnter"
          @mouseleave="tiltCards[index].onMouseLeave"
          class="benefit-card group relative bg-surface rounded-3xl p-8 border border-border-sutil hover:border-primary/40 transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_30px_60px_-15px_rgba(0,0,0,0.1)] dark:hover:shadow-[0_30px_60px_-15px_rgba(96,165,250,0.15)]">

          <!-- Icon Circle with Luxury Animation -->
          <div
            class="w-16 h-16 mb-6 flex items-center justify-center rounded-2xl bg-surface-hover group-hover:bg-primary transition-all duration-500 group-hover:scale-110 group-hover:rotate-3 group-hover:shadow-[0_10px_25px_-5px_rgba(37,99,235,0.4)]">
            <component :is="iconComponents[benefit.icon]"
              class="w-7 h-7 text-text-muted group-hover:text-white transition-colors duration-500" />
          </div>

          <!-- Content -->
          <h3 class="text-xl font-bold text-text-main mb-3 group-hover:text-primary transition-colors duration-300">
            {{ benefit.title }}
          </h3>
          <p class="text-sm text-text-muted leading-relaxed group-hover:text-text-main/90 transition-colors duration-300">
            {{ benefit.description }}
          </p>

          <!-- Glass/Shine Effect Layer -->
          <div class="absolute inset-0 rounded-3xl overflow-hidden pointer-events-none">
            <div class="shine-element absolute inset-0 opacity-0 group-hover:opacity-100"></div>
          </div>

          <!-- Subtle Bottom Border Indicator -->
          <div
            class="absolute bottom-0 left-8 right-8 h-1 bg-linear-to-r from-transparent via-primary/50 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-px">
          </div>
        </div>
      </div>
    </BaseContainer>
  </section>
</template>

<style scoped>
.benefit-card {
  /* Garante que o conteúdo fique acima do brilho */
  isolation: isolate;
}

.shine-element {
  background: linear-gradient(135deg,
      transparent 0%,
      transparent 45%,
      rgba(255, 255, 255, 0.1) 50%,
      transparent 55%,
      transparent 100%);
  transform: translateX(-100%);
  transition: none;
}

.dark .shine-element {
  background: linear-gradient(135deg,
      transparent 0%,
      transparent 45%,
      rgba(96, 165, 250, 0.08) 50%,
      transparent 55%,
      transparent 100%);
}

.benefit-card:hover .shine-element {
  animation: shine-flow 1.2s cubic-bezier(0.4, 0, 0.2, 1) forwards;
}

@keyframes shine-flow {
  from {
    transform: translateX(-150%) skewX(-20deg);
  }

  to {
    transform: translateX(150%) skewX(-20deg);
  }
}
</style>
