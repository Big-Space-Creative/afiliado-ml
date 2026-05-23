<script setup>
import { ArrowUpRight } from 'lucide-vue-next'

defineProps({
  kpi: {
    type: Object,
    required: true
  }
})
</script>

<template>
  <article
    class="bg-surface-hover/40 dark:bg-surface-hover/10 rounded-2xl p-4 sm:p-5 hover:bg-surface-hover/60 dark:hover:bg-surface-hover/20 transition-all duration-300 border border-border-sutil shadow-sm hover:shadow-md">
    <div class="flex flex-col gap-1.5">
      <div class="flex items-center justify-between">
        <span class="text-[13px] font-medium text-text-muted">{{ kpi.label }}</span>
      </div>
      <div class="flex items-center justify-between">
        <p class="text-2xl md:text-[28px] font-semibold text-text-main tracking-tight leading-none">{{ kpi.value }}</p>
        <span v-if="kpi.trendUp"
          class="inline-flex items-center gap-0.5 text-[11px] font-semibold text-emerald-500 bg-emerald-500/10 border border-emerald-500/20 px-1.5 py-0.5 rounded">
          <ArrowUpRight class="w-3 h-3" />
          {{ kpi.trend }}
        </span>
      </div>
    </div>
  </article>
</template>
