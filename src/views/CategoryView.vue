<template>
  <main-layout :title="category ? category.title : '分类'">
    <div class="category-view" v-if="category">
      <div class="category-header">
        <h1>{{ category.title }}</h1>
        <p class="category-description">{{ category.description }}</p>
      </div>
      
      <!-- 子分类列表 -->
      <div class="subcategories-section" v-if="subcategories.length > 0">
        <h2>子分类</h2>
        <div class="subcategories-grid">
          <router-link
            v-for="subcategory in subcategories"
            :key="subcategory.id"
            :to="`/category/${subcategory.id}`"
            class="subcategory-card"
          >
            <h3>{{ subcategory.title }}</h3>
            <p>{{ subcategory.description }}</p>
          </router-link>
        </div>
      </div>
      
      <!-- 文章列表 -->
      <div class="articles-section">
        <h2>文章列表</h2>
        <div v-if="articles.length > 0" class="articles-list">
          <router-link
            v-for="article in articles"
            :key="article.id"
            :to="`/article/${article.id}`"
            class="article-item"
          >
            <div class="article-title">{{ article.title }}</div>
            <div class="article-meta">
              <div class="article-tags">
                <span v-for="(tag, index) in article.tags" :key="index" class="article-tag">
                  {{ tag }}
                </span>
              </div>
              <div class="article-date">{{ formatDate(article.updatedAt) }}</div>
            </div>
          </router-link>
        </div>
        <div v-else class="empty-state">
          <p>该分类下暂无文章</p>
        </div>
      </div>
      
      <!-- 返回上级分类 -->
      <div class="back-section" v-if="parentCategory">
        <router-link :to="parentCategory.id ? `/category/${parentCategory.id}` : '/'" class="back-link">
          <van-icon name="arrow-left" />
          <span>返回{{ parentCategory.id ? parentCategory.title : '首页' }}</span>
        </router-link>
      </div>
    </div>
    
    <div v-else class="loading-state">
      <van-loading type="spinner" color="var(--primary-color)" />
      <p>加载中...</p>
    </div>
  </main-layout>
</template>

<script lang="ts">
import { defineComponent, computed, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import MainLayout from '@/layouts/MainLayout.vue'
import { useWikiStore } from '@/stores/wiki'
import { Icon, Loading } from 'vant'

export default defineComponent({
  name: 'CategoryView',
  components: {
    MainLayout,
    VanIcon: Icon,
    VanLoading: Loading
  },
  setup() {
    const route = useRoute()
    const wikiStore = useWikiStore()
    
    const categoryId = computed(() => route.params.categoryId as string)
    
    const category = computed(() => {
      return wikiStore.getCategoryById(categoryId.value)
    })
    
    const parentCategory = computed(() => {
      if (!category.value || category.value.parentId === null) {
        return { id: '', title: '首页' }
      }
      return wikiStore.getCategoryById(category.value.parentId) || { id: '', title: '首页' }
    })
    
    const subcategories = computed(() => {
      return wikiStore.getCategoriesByParentId(categoryId.value)
    })
    
    const articles = computed(() => {
      return wikiStore.getArticlesByCategoryId(categoryId.value)
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
      category,
      parentCategory,
      subcategories,
      articles,
      formatDate
    }
  }
})
</script>

<style scoped>
.category-view {
  padding: 0.16rem 0; /* 16px */
}

.category-header {
  margin-bottom: 0.24rem; /* 24px */
}

.category-description {
  color: color-mix(in srgb, var(--text-color) 80%, transparent);
  font-size: 0.16rem; /* 16px */
  margin-top: 0.08rem; /* 8px */
}

.subcategories-section,
.articles-section {
  margin-bottom: 0.3rem; /* 30px */
}

.subcategories-section h2,
.articles-section h2 {
  margin-bottom: 0.16rem; /* 16px */
  position: relative;
  padding-left: 0.12rem; /* 12px */
}

.subcategories-section h2::before,
.articles-section h2::before {
  content: '';
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 0.04rem; /* 4px */
  height: 0.2rem; /* 20px */
  background-color: var(--primary-color);
  border-radius: 0.02rem; /* 2px */
}

.subcategories-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(3rem, 1fr)); /* 300px */
  gap: 0.16rem; /* 16px */
}

.subcategory-card {
  background-color: var(--card-bg);
  border-radius: 0.08rem; /* 8px */
  padding: 0.16rem; /* 16px */
  text-decoration: none;
  color: var(--text-color);
  transition: transform 0.2s, box-shadow 0.2s;
}

.subcategory-card:hover {
  transform: translateY(-0.04rem); /* -4px */
  box-shadow: 0 0.04rem 0.08rem rgba(0, 0, 0, 0.1); /* 4px 8px */
}

.subcategory-card h3 {
  color: var(--primary-color);
  margin-top: 0;
  margin-bottom: 0.08rem; /* 8px */
}

.subcategory-card p {
  margin: 0;
  font-size: 0.14rem; /* 14px */
  color: color-mix(in srgb, var(--text-color) 80%, transparent);
}

.articles-list {
  display: flex;
  flex-direction: column;
  gap: 0.12rem; /* 12px */
}

.article-item {
  display: flex;
  flex-direction: column;
  padding: 0.16rem; /* 16px */
  background-color: var(--card-bg);
  border-radius: 0.08rem; /* 8px */
  text-decoration: none;
  color: var(--text-color);
  transition: background-color 0.2s;
}

.article-item:hover {
  background-color: color-mix(in srgb, var(--card-bg) 90%, var(--primary-color));
}

.article-title {
  font-weight: 500;
  font-size: 0.18rem; /* 18px */
  margin-bottom: 0.08rem; /* 8px */
}

.article-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.12rem; /* 12px */
}

.article-tags {
  display: flex;
  gap: 0.08rem; /* 8px */
}

.article-tag {
  background-color: color-mix(in srgb, var(--primary-color) 20%, transparent);
  color: var(--primary-color);
  padding: 0.02rem 0.08rem; /* 2px 8px */
  border-radius: 0.1rem; /* 10px */
}

.article-date {
  color: color-mix(in srgb, var(--text-color) 70%, transparent);
}

.back-section {
  margin-top: 0.24rem; /* 24px */
}

.back-link {
  display: inline-flex;
  align-items: center;
  gap: 0.08rem; /* 8px */
  color: var(--primary-color);
  text-decoration: none;
  font-size: 0.16rem; /* 16px */
}

.empty-state,
.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 0.5rem 0; /* 50px */
  color: color-mix(in srgb, var(--text-color) 70%, transparent);
}

.loading-state {
  height: 50vh;
  gap: 0.16rem; /* 16px */
}

/* 响应式调整 */
@media (max-width: 750px) {
  .subcategories-grid {
    grid-template-columns: 1fr;
  }
}
</style>
