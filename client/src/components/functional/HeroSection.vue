<script setup>
import { onMounted, ref, computed } from 'vue'
import { useMouseInElement } from '@vueuse/core'
import gsap from 'gsap'
import BaseContainer from '@/components/ui/BaseContainer.vue'
import BaseButton from '@/components/ui/BaseButton.vue'

// Refs
const heroContainer = ref(null)
const heroImageRef = ref(null)
const heroText = ref(null)

// Parallax Logic
const { elementX, elementY, isOutside, elementHeight, elementWidth } = useMouseInElement(heroContainer)

const cardStyle = computed(() => {
  if (isOutside.value) return {
    transform: 'rotateX(0deg) rotateY(0deg)',
    transition: 'transform 0.6s cubic-bezier(0.2, 0.8, 0.2, 1)'
  }

  const x = elementX.value - elementWidth.value / 2
  const y = elementY.value - elementHeight.value / 2

  const rotateX = (y / elementHeight.value) * -3 // Reduced for premium feel
  const rotateY = (x / elementWidth.value) * 3

  return {
    transform: `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
    transition: 'transform 0.3s cubic-bezier(0.2, 0.8, 0.2, 1)'
  }
})

onMounted(() => {
  const tl = gsap.timeline()

  // Text Stagger
  tl.from(heroText.value.children, {
    y: 60,
    opacity: 0,
    duration: 1.2,
    stagger: 0.15,
    ease: 'power3.out'
  })

  // Image Pop
  tl.from(heroContainer.value, {
    y: 60,
    opacity: 0,
    scale: 0.98,
    duration: 1.4,
    ease: 'power2.out'
  }, "-=1.0")
})

// Placeholder image for the headphones - using a high-quality Unsplash image that matches the vibe
// In a real scenario, this would be an asset from the project
const heroImage = "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=2070&auto=format&fit=crop"
</script>

<template>
  <section class="pt-8 pb-12 md:pt-12 md:pb-16 bg-white overflow-hidden">
    <BaseContainer>
      <!-- Header Text -->
      <div ref="heroText" class="text-center max-w-4xl mx-auto mb-10 md:mb-14 relative z-10">
        <span class="inline-block text-[10px] md:text-xs font-bold tracking-widest text-gray-500 uppercase mb-4">
          Limited Offer
        </span>
        <h1 class="text-4xl md:text-6xl lg:text-[64px] font-bold text-[#0F1113] leading-[1.1] tracking-tight">
          All the products<br class="hidden sm:block" />
          you ever wanted
        </h1>
      </div>

      <!-- Hero Banner (Yellow Box) -->
      <div ref="heroContainer" class="relative w-full rounded-[32px] overflow-hidden mb-12 group perspective-container">
        <!-- Background Color -->
        <div class="absolute inset-0 bg-[#F9D52C] transition-transform duration-700 ease-out group-hover:scale-105">
        </div>

        <!-- Content Container -->
        <div class="relative h-[300px] md:h-[400px] lg:h-[500px] flex items-center justify-center" :style="cardStyle">
          <!-- Product Image -->
          <img ref="heroImageRef" :src="heroImage" alt="Premium Wireless Headphones" loading="eager"
            class="w-full h-full object-cover shadow-2xl" />
        </div>
      </div>

      <!-- Bottom Information Bar -->
      <div class="flex flex-col md:flex-row items-center items-start justify-between gap-8 md:gap-12">
        <!-- Discount Text -->
        <div class="text-center md:text-left">
          <h2 class="text-2xl md:text-3xl font-bold text-[#0F1113] leading-tight">
            Get 25% discount
          </h2>
          <p class="text-2xl md:text-3xl font-bold text-[#0F1113] leading-tight opacity-50">
            only available today
          </p>
        </div>

        <!-- Description & Actions -->
        <div class="flex flex-col md:flex-col items-start gap-6 md:gap-8 w-full md:w-auto">
          <p class="text-sm md:text-base text-gray-500 max-w-sm text-center md:text-left leading-relaxed">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit.
            Suspendisse varius enim in eros elementum tristique.
            Duis cursus, mi quis viverra ornare.
          </p>

          <div class="flex items-center gap-3 w-full md:w-auto">
            <BaseButton variant="primary" class="flex-1 md:flex-none justify-center px-8">
              Button
            </BaseButton>
            <BaseButton variant="secondary" class="flex-1 md:flex-none justify-center px-8">
              Button
            </BaseButton>
          </div>
        </div>
      </div>
    </BaseContainer>
  </section>
</template>

<style scoped>
/* Optional: Add specific local animations if needed, currently using Tailwind utilities */
</style>
