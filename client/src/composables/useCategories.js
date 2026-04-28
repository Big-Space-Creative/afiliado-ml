import { ref, onMounted } from 'vue'
import http from '@/services/http'

export function useCategories(options = {}) {
  const { onlyParents = false } = options
  const categories = ref([])
  const isLoading = ref(false)
  const error = ref(null)

  const fetchCategories = async () => {
    isLoading.value = true
    error.value = null
    try {
      const params = {}
      if (onlyParents) {
        params.onlyParents = true
      }

      const { data } = await http.get('/categorias', { params })
      
      // Mapeia os dados da API para o formato esperado pela UI
      categories.value = (data?.data || []).map(cat => ({
        id: cat.id,
        name: cat.name,
        slug: cat.slug,
        // Fallback para descrição se não houver no banco ainda
        desc: cat.description || `Confira nossa seleção exclusiva de produtos para ${cat.name}.`,
        // Cálculo de contagem (a API deve retornar product_count ou similar futuramente)
        count: `${cat.product_count || 0} Produtos`
      }))
    } catch (err) {
      console.error('Erro ao buscar categorias:', err)
      error.value = 'Não foi possível carregar as categorias.'
    } finally {
      isLoading.value = false
    }
  }

  // Busca automática se não for controlado manualmente
  onMounted(() => {
    if (categories.value.length === 0) {
      fetchCategories()
    }
  })

  return {
    categories,
    isLoading,
    error,
    fetchCategories
  }
}
