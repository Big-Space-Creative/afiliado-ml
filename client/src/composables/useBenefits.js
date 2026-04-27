/**
 * useBenefits - Composable para dados de benefícios
 * Usado em: BenefitsSection
 */

import { Truck, Star, ShieldCheck, Lock } from 'lucide-vue-next'

const benefits = [
    {
        icon: 'truck',
        title: 'Frete Grátis e Devoluções',
        description: 'Frete grátis em compras acima de R$ 200. Devolução fácil em até 30 dias.'
    },
    {
        icon: 'star',
        title: 'Avaliação 4.8 dos Clientes',
        description: 'Junte-se a mais de 5.000 clientes satisfeitos que amam nossos produtos.'
    },
    {
        icon: 'shield',
        title: '30 Dias de Garantia',
        description: 'Não ficou satisfeito? Receba seu dinheiro de volta, sem perguntas.'
    },
    {
        icon: 'lock',
        title: 'Pagamentos Seguros',
        description: 'Seus dados são protegidos com segurança de nível empresarial.'
    }
]

const iconComponents = {
    truck: Truck,
    star: Star,
    shield: ShieldCheck,
    lock: Lock
}

export function useBenefits() {
    return {
        benefits,
        iconComponents
    }
}
