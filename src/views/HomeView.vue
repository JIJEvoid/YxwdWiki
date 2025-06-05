<template>
  <main-layout title="首页">
    <div class="home-view">
      <div class="welcome-section">
        <h1>欢迎使用 YxwdWiki</h1>
        <p class="subtitle">一个现代化的移动端 Wiki 文档网站</p>
      </div>
      
      <div class="categories-section">
        <h2>文档分类</h2>
        <div class="categories-grid">
          <router-link
            v-for="category in rootCategories"
            :key="category.id"
            :to="`/category/${category.id}`"
            class="category-card"
          >
            <h3>{{ category.title }}</h3>
            <p>{{ category.description }}</p>
          </router-link>
        </div>
      </div>
      
      <div class="recent-articles-section">
        <h2>最近更新</h2>
        <div class="articles-list">
          <router-link
            v-for="article in recentArticles"
            :key="article.id"
            :to="`/article/${article.id}`"
            class="article-item"
          >
            <div class="article-title">{{ article.title }}</div>
            <div class="article-date">{{ formatDate(article.updatedAt) }}</div>
          </router-link>
        </div>
      </div>
    </div>
  </main-layout>
</template>

<script lang="ts">
import { defineComponent, computed, onMounted } from 'vue'
import MainLayout from '@/layouts/MainLayout.vue'
import { useWikiStore } from '@/stores/wiki'

export default defineComponent({
  name: 'HomeView',
  components: {
    MainLayout
  },
  setup() {
    const wikiStore = useWikiStore()
    
    const rootCategories = computed(() => {
      return wikiStore.getCategoriesByParentId(null)
    })
    
    const recentArticles = computed(() => {
      return [...wikiStore.articles]
        .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
        .slice(0, 5)
    })
    
    const formatDate = (dateString: string) => {
      const date = new Date(dateString)
      return date.toLocaleDateString('zh-CN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    }
    
    onMounted(() => {
      if (wikiStore.categories.length === 0) {
        wikiStore.loadData()
      }
    })
    
    return {
      rootCategories,
      recentArticles,
      formatDate
    }
  }
})
</script>

<style scoped>
.home-view {
  padding: 16px 0;
}

.welcome-section {
  text-align: center;
  margin-bottom: 30px;
}

.subtitle {
  color: color-mix(in srgb, var(--text-color) 80%, transparent);
  font-size: 18px;
}

.categories-section,
.recent-articles-section {
  margin-bottom: 30px;
}

.categories-section h2,
.recent-articles-section h2 {
  margin-bottom: 16px;
  position: relative;
  padding-left: 12px;
}

.categories-section h2::before,
.recent-articles-section h2::before {
  content: '';
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 4px;
  height: 20px;
  background-color: var(--primary-color);
  border-radius: 2px;
}

.categories-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 16px;
}

.category-card {
  background-color: var(--card-bg);
  border-radius: 8px;
  padding: 16px;
  text-decoration: none;
  color: var(--text-color);
  transition: transform 0.2s, box-shadow 0.2s;
}

.category-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.category-card h3 {
  color: var(--primary-color);
  margin-top: 0;
  margin-bottom: 8px;
}

.category-card p {
  margin: 0;
  font-size: 14px;
  color: color-mix(in srgb, var(--text-color) 80%, transparent);
}

.articles-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.article-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  background-color: var(--card-bg);
  border-radius: 8px;
  text-decoration: none;
  color: var(--text-color);
  transition: background-color 0.2s;
}

.article-item:hover {
  background-color: color-mix(in srgb, var(--card-bg) 90%, var(--primary-color));
}

.article-title {
  font-weight: 500;
}

.article-date {
  font-size: 12px;
  color: color-mix(in srgb, var(--text-color) 70%, transparent);
}

/* 响应式调整 */
@media (max-width: 750px) {
  .categories-grid {
    grid-template-columns: 1fr;
  }
}
</style>
