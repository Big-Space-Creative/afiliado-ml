import { ref } from 'vue'

export function useCategories() {
  const categories = ref([
    {
      id: 1,
      name: 'Smartphones & Tablets',
      count: '120+ Produtos',
      desc: 'Os ultimos lancamentos em tecnologia movel, com as melhores cameras e desempenho absurdo para o seu dia a dia.'
    },
    {
      id: 2,
      name: 'Notebooks',
      count: '85+ Produtos',
      desc: 'Maquinas de alta performance.'
    },
    {
      id: 3,
      name: 'TVs & Audio',
      count: '64+ Produtos',
      desc: 'Cinema imersivo em casa.'
    },
    {
      id: 4,
      name: 'Gaming',
      count: '52+ Produtos',
      desc: 'Consoles, acessorios e perifericos para elevar seu setup.'
    },
    {
      id: 5,
      name: 'Casa Inteligente',
      count: '41+ Produtos',
      desc: 'Automacao residencial com praticidade, seguranca e controle total.'
    },
    {
      id: 6,
      name: 'Wearables',
      count: '33+ Produtos',
      desc: 'Relogios e pulseiras inteligentes para saude, treino e produtividade.'
    }
  ])

  return {
    categories
  }
}
