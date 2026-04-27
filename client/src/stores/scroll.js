import { defineStore } from 'pinia'
import { ref } from 'vue'

/**
 * Store para a instância global do Lenis (smooth scroll).
 * Substitui o anti-pattern window.__lenis com estado reativo e testável.
 */
export const useScrollStore = defineStore('scroll', () => {
  const lenis = ref(null)
  return { lenis }
})
