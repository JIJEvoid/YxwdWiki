import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export interface Category {
  id: string
  title: string
  description: string
  parentId: string | null
  order: number
}

export interface Article {
  id: string
  title: string
  content: string
  categoryId: string
  tags: string[]
  createdAt: string
  updatedAt: string
}

export const useWikiStore = defineStore('wiki', () => {
  const categories = ref<Category[]>([])
  const articles = ref<Article[]>([])
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  // Get categories by parent ID
  const getCategoriesByParentId = computed(() => {
    return (parentId: string | null) => {
      return categories.value
        .filter(category => category.parentId === parentId)
        .sort((a, b) => a.order - b.order)
    }
  })

  // Get category by ID
  const getCategoryById = computed(() => {
    return (id: string) => {
      return categories.value.find(category => category.id === id) || null
    }
  })

  // Get articles by category ID
  const getArticlesByCategoryId = computed(() => {
    return (categoryId: string) => {
      return articles.value
        .filter(article => article.categoryId === categoryId)
        .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    }
  })

  // Get article by ID
  const getArticleById = computed(() => {
    return (id: string) => {
      return articles.value.find(article => article.id === id) || null
    }
  })

  // Search articles and categories
  const search = (query: string) => {
    const normalizedQuery = query.toLowerCase().trim()
    
    if (!normalizedQuery) return { matchedCategories: [], matchedArticles: [] }
    
    const matchedCategories = categories.value.filter(
      category => 
        category.title.toLowerCase().includes(normalizedQuery) || 
        category.description.toLowerCase().includes(normalizedQuery)
    )
    
    const matchedArticles = articles.value.filter(
      article => 
        article.title.toLowerCase().includes(normalizedQuery) || 
        article.content.toLowerCase().includes(normalizedQuery) ||
        article.tags.some(tag => tag.toLowerCase().includes(normalizedQuery))
    )
    
    return { matchedCategories, matchedArticles }
  }

  // Load data from API or local storage
  const loadData = async () => {
    isLoading.value = true
    error.value = null
    
    try {
      // In a real application, you would fetch data from an API
      // For now, we'll use mock data from local storage or create default data
      const savedCategories = localStorage.getItem('wiki_categories')
      const savedArticles = localStorage.getItem('wiki_articles')
      
      if (savedCategories) {
        categories.value = JSON.parse(savedCategories)
      } else {
        // Create default categories
        categories.value = [
          {
            id: '1',
            title: 'Getting Started',
            description: 'Introduction to the Wiki',
            parentId: null,
            order: 1
          },
          {
            id: '2',
            title: 'User Guide',
            description: 'How to use the Wiki',
            parentId: null,
            order: 2
          },
          {
            id: '3',
            title: 'Advanced Topics',
            description: 'In-depth information',
            parentId: null,
            order: 3
          }
        ]
        
        localStorage.setItem('wiki_categories', JSON.stringify(categories.value))
      }
      
      if (savedArticles) {
        articles.value = JSON.parse(savedArticles)
      } else {
        // Create default articles
        articles.value = [
          {
            id: '1',
            title: 'Welcome to YxwdWiki',
            content: '# Welcome to YxwdWiki\n\nThis is a modern mobile Wiki documentation site built with Vue 3, TypeScript, and Vite.\n\n## Features\n\n- Mobile-first design\n- Responsive layout\n- Dark mode support\n- Markdown content\n- Offline support with PWA',
            categoryId: '1',
            tags: ['welcome', 'introduction'],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          },
          {
            id: '2',
            title: 'How to Navigate',
            content: '# How to Navigate\n\nYou can navigate through the Wiki using the navigation menu.\n\n## Mobile Navigation\n\nOn mobile devices, tap the menu icon to open the navigation drawer.\n\n## Desktop Navigation\n\nOn desktop, the navigation menu is always visible on the left side of the screen.',
            categoryId: '2',
            tags: ['navigation', 'guide'],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          }
        ]
        
        localStorage.setItem('wiki_articles', JSON.stringify(articles.value))
      }
    } catch (err) {
      console.error('Failed to load wiki data:', err)
      error.value = 'Failed to load wiki data. Please try again later.'
    } finally {
      isLoading.value = false
    }
  }

  return {
    categories,
    articles,
    isLoading,
    error,
    getCategoriesByParentId,
    getCategoryById,
    getArticlesByCategoryId,
    getArticleById,
    search,
    loadData
  }
})
