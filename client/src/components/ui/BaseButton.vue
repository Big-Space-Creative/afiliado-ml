<script setup>
import { computed } from 'vue'
import { RouterLink } from 'vue-router'

/**
 * BaseButton - Botão reutilizável com variantes
 * @prop {string} variant - 'primary' | 'secondary' | 'outline'
 * @prop {string} size - 'sm' | 'md' | 'lg'
 * @prop {boolean} disabled
 * @prop {string} href - Link externo
 * @prop {string|object} to - Link interno (RouterLink)
 * @prop {string} target - Target do link
 */

const props = defineProps({
    variant: {
        type: String,
        default: 'primary',
        validator: (value) => ['primary', 'secondary', 'outline'].includes(value)
    },
    size: {
        type: String,
        default: 'md',
        validator: (value) => ['sm', 'md', 'lg'].includes(value)
    },
    disabled: {
        type: Boolean,
        default: false
    },
    href: {
        type: String,
        default: null
    },
    to: {
        type: [String, Object],
        default: null
    },
    target: {
        type: String,
        default: '_self'
    }
})

const variantClasses = {
    primary: 'bg-primary text-white hover:bg-primary-dark shadow-sm hover:shadow-primary/30',
    secondary: 'bg-text-main text-surface hover:opacity-90 shadow-sm hover:shadow-neutral-950/20',
    outline: 'bg-transparent border border-border-main text-text-main hover:bg-surface-hover'
}

const sizeClasses = {
    sm: 'px-6 py-2.5 text-sm',
    md: 'px-8 py-3 text-sm',
    lg: 'px-10 py-4 text-base'
}

const computedTag = computed(() => {
    if (props.to) return RouterLink
    if (props.href) return 'a'
    return 'button'
})
</script>

<template>
    <component :is="computedTag" :to="props.to" :href="props.href" :target="props.href ? props.target : null" :class="[
        'inline-flex items-center justify-center font-medium rounded-xl transition-all duration-300 cursor-pointer ease-out',
        'transform hover:scale-102 active:scale-95',
        'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary',
        props.disabled ? 'opacity-50 cursor-not-allowed active:scale-100 hover:scale-100' : '',
        variantClasses[props.variant],
        sizeClasses[props.size]
    ]" :disabled="props.disabled">
        <slot />
    </component>
</template>
