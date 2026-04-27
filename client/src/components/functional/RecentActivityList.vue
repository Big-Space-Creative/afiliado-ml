<script setup>
import { Clock, Package, Tag, AlertTriangle } from 'lucide-vue-next'

defineProps({
  activities: {
    type: Array,
    required: true
  }
})
</script>

<template>
  <article class="bg-surface rounded-2xl border border-border-sutil p-5 md:p-6 shadow-[0_1px_3px_0_rgba(0,0,0,0.02)] hover:shadow-sm transition-all duration-300">
    <div class="flex items-center justify-between mb-5">
      <div>
        <h3 class="text-base font-semibold text-text-main">Atividade Recente</h3>
        <p class="text-xs text-text-muted mt-0.5">Últimas ações no sistema</p>
      </div>
      <Clock class="w-4 h-4 text-text-muted" />
    </div>

    <div class="space-y-0">
      <div v-for="(activity, index) in activities" :key="activity.id" class="flex gap-3 py-3"
        :class="{ 'border-b border-border-sutil': index < activities.length - 1 }">
        <!-- Ícone do tipo de ação -->
        <div class="shrink-0 mt-0.5">
          <div :class="[
            'w-8 h-8 rounded-lg flex items-center justify-center',
            activity.action.includes('cadastrado') ? 'bg-emerald-500/10 border border-emerald-500/20' :
              activity.action.includes('criada') ? 'bg-primary/10 border border-primary/20' :
                'bg-amber-500/10 border border-amber-500/20'
          ]">
            <component :is="activity.action.includes('cadastrado') ? Package :
              activity.action.includes('criada') ? Tag :
                AlertTriangle" :class="[
                      'w-4 h-4',
                      activity.action.includes('cadastrado') ? 'text-emerald-500' :
                        activity.action.includes('criada') ? 'text-primary' :
                          'text-amber-500'
                    ]" />
          </div>
        </div>
        <!-- Info -->
        <div class="min-w-0 flex-1">
          <p class="text-sm text-text-main font-medium truncate">{{ activity.action }}</p>
          <p class="text-xs text-text-muted truncate">{{ activity.item }}</p>
        </div>
        <span class="text-xs text-text-muted/50 whitespace-nowrap shrink-0">{{ activity.time }}</span>
      </div>
    </div>
  </article>
</template>
