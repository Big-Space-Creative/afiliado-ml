<script setup>
/**
 * BaseButton - Botão reutilizável com variantes
 * @prop {string} variant - 'primary' | 'secondary' | 'outline'
 * @prop {string} size - 'sm' | 'md' | 'lg'
 * @prop {boolean} disabled
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
    }
})

const variantClasses = {
    primary: 'bg-primary text-white hover:bg-primary-dark shadow-lg hover:shadow-primary/25',
    secondary: 'bg-gray-950 text-white hover:bg-gray-800 shadow-lg hover:shadow-gray-950/25',
    outline: 'bg-transparent border border-gray-200 text-gray-950 hover:bg-gray-50'
}

const sizeClasses = {
    sm: 'px-6 py-2.5 text-sm',
    md: 'px-8 py-3 text-sm',
    lg: 'px-10 py-4 text-base'
}
</script>

<template>
    <button :class="[
        'inline-flex items-center justify-center font-medium rounded-xl transition-all duration-300 cursor-pointer ease-out',
        'transform hover:scale-105 active:scale-95',
        'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary',
        'disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100 disabled:hover:scale-100',
        variantClasses[props.variant],
        sizeClasses[props.size]
    ]" :disabled="props.disabled">
        <slot />
    </button>
</template>
