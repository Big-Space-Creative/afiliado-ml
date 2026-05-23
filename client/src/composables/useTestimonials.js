/**
 * useTestimonials - Composable para dados de depoimentos
 * Usado em: TestimonialsSection
 */

import { computed } from 'vue'

const testimonials = [
    {
        id: 1,
        text: 'Absolutamente amei a qualidade! O produto superou minhas expectativas e o atendimento ao cliente foi excepcional.',
        author: 'Ana Silva',
        role: 'Designer',
        avatar: 'https://i.pravatar.cc/100?img=32',
        rating: 5
    },
    {
        id: 2,
        text: 'Entrega rápida e o produto é exatamente como nas fotos. Com certeza comprarei novamente em breve!',
        author: 'Ricardo Santos',
        role: 'Desenvolvedor',
        avatar: 'https://i.pravatar.cc/100?img=11',
        rating: 5
    },
    {
        id: 3,
        text: "Melhor compra que fiz este ano. A atenção aos detalhes é incrível e vale cada centavo.",
        author: 'Carla Dias',
        role: 'Gerente de Marketing',
        avatar: 'https://i.pravatar.cc/100?img=5',
        rating: 5
    },
    {
        id: 4,
        text: 'Eu estava cético no início, mas este produto mudou completamente minha rotina diária. Altamente recomendado!',
        author: 'Marcos Oliveira',
        role: 'Empreendedor',
        avatar: 'https://i.pravatar.cc/100?img=12',
        rating: 5
    },
    {
        id: 5,
        text: 'A qualidade premium realmente transparece. Meus amigos sempre perguntam onde comprei. Ótimo custo-benefício.',
        author: 'Fernanda Lima',
        role: 'Criadora de Conteúdo',
        avatar: 'https://i.pravatar.cc/100?img=45',
        rating: 5
    },
    {
        id: 6,
        text: 'O suporte ao cliente fez de tudo para me ajudar. O produto chegou perfeitamente embalado.',
        author: 'Daniel Souza',
        role: 'Gerente de Produto',
        avatar: 'https://i.pravatar.cc/100?img=15',
        rating: 5
    }
]

export function useTestimonials() {
    // Triplicado para efeito marquee infinito
    const infiniteList = computed(() => [
        ...testimonials,
        ...testimonials,
        ...testimonials
    ])

    return {
        testimonials,
        infiniteList
    }
}
