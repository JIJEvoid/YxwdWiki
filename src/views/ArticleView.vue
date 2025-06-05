<template>
  <main-layout :title="article ? article.title : '文章'">
    <div class="article-view" v-if="article">
      <div class="article-header">
        <h1>{{ article.title }}</h1>
        <div class="article-meta">
          <div class="article-tags">
            <span v-for="(tag, index) in article.tags" :key="index" class="article-tag">
              {{ tag }}
            </span>
          </div>
          <div class="article-date">
            更新于: {{ formatDate(article.updatedAt) }}
          </div>
        </div>
      </div>
      
      <div class="article-content">
        <markdown-renderer :content="article.content" />
      </div>
      
      <div class="article-footer">
        <div class="article-category" v-if="category">
          <span>分类:</span>
          <router-link :to="`/category/${category.id}`">{{ category.title }}</router-link>
        </div>
        
        <div class="article-navigation">
          <router-link 
            v-if="prevArticle" 
            :to="`/article/${prevArticle.id}`" 
            class="prev-article"
          >
            <van-icon name="arrow-left" />
            <span>{{ prevArticle.title }}</span>
          </router-link>
          
          <router-link 
            v-if="nextArticle" 
            :to="`/article/${nextArticle.id}`" 
            class="next-article"
          >
            <span>{{ nextArticle.title }}</span>
            <van-icon name="arrow" />
          </router-link>
        </div>
      </div>
    </div>
    
    <div v-else class="loading-state">
      <van-loading type="spinner" color="var(--primary-color)" />
      <p>加载中...</p>
    </div>
  </main-layout>
</template>

<script lang="ts">
import { defineComponent, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import MainLayout from '@/layouts/MainLayout.vue'
import MarkdownRenderer from '@/components/MarkdownRenderer.vue'
import { useWikiStore } from '@/stores/wiki'
import { Icon, Loading } from 'vant'

export default defineComponent({
  name: 'ArticleView',
  components: {
    MainLayout,
    MarkdownRenderer,
    VanIcon: Icon,
    VanLoading: Loading
  },
  setup() {
    const route = useRoute()
    const wikiStore = useWikiStore()
    
    const articleId = computed(() => route.params.articleId as string)
    
    const article = computed(() => {
      return wikiStore.getArticleById(articleId.value)
    })
    
    const category = computed(() => {
      if (!article.value) return null
      return wikiStore.getCategoryById(article.value.categoryId)
    })
    
    const categoryArticles = computed(() => {
      if (!article.value) return []
      return wikiStore.getArticlesByCategoryId(article.value.categoryId)
    })
    
    const currentIndex = computed(() => {
      if (!article.value) return -1
      return categoryArticles.value.findIndex(a => a.id === article.value?.id)
    })
    
    const prevArticle = computed(() => {
      if (currentIndex.value <= 0) return null
      return categoryArticles.value[currentIndex.value - 1]
    })
    
    const nextArticle = computed(() => {
      if (currentIndex.value === -1 || currentIndex.value === categoryArticles.value.length - 1) return null
      return categoryArticles.value[currentIndex.value + 1]
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
      if (wikiStore.articles.length === 0) {
        wikiStore.loadData()
      }
      
      // 滚动到顶部
      window.scrollTo(0, 0)
    })
    
    return {
      article,
      category,
      prevArticle,
      nextArticle,
      formatDate
    }
  }
})
</script>

<style scoped>
.article-view {
  padding: 0.16rem 0; /* 16px */
}

.article-header {
  margin-bottom: 0.24rem; /* 24px */
}

.article-meta {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: center;
  margin-top: 0.12rem; /* 12px */
  gap: 0.12rem; /* 12px */
}

.article-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.08rem; /* 8px */
}

.article-tag {
  background-color: color-mix(in srgb, var(--primary-color) 20%, transparent);
  color: var(--primary-color);
  padding: 0.02rem 0.08rem; /* 2px 8px */
  border-radius: 0.1rem; /* 10px */
  font-size: 0.12rem; /* 12px */
}

.article-date {
  color: color-mix(in srgb, var(--text-color) 70%, transparent);
  font-size: 0.14rem; /* 14px */
}

.article-content {
  margin-bottom: 0.3rem; /* 30px */
  padding-bottom: 0.3rem; /* 30px */
  border-bottom: 1px solid var(--border-color);
}

.article-footer {
  display: flex;
  flex-direction: column;
  gap: 0.2rem; /* 20px */
}

.article-category {
  display: flex;
  align-items: center;
  gap: 0.08rem; /* 8px */
  font-size: 0.14rem; /* 14px */
}

.article-category span {
  color: color-mix(in srgb, var(--text-color) 70%, transparent);
}

.article-category a {
  color: var(--primary-color);
  text-decoration: none;
}

.article-navigation {
  display: flex;
  justify-content: space-between;
  margin-top: 0.16rem; /* 16px */
}

.prev-article,
.next-article {
  display: flex;
  align-items: center;
  gap: 0.08rem; /* 8px */
  color: var(--primary-color);
  text-decoration: none;
  font-size: 0.14rem; /* 14px */
  max-width: 45%;
}

.prev-article span,
.next-article span {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 50vh;
  gap: 0.16rem; /* 16px */
  color: color-mix(in srgb, var(--text-color) 70%, transparent);
}

/* 响应式调整 */
@media (max-width: 750px) {
  .article-meta {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .article-navigation {
    flex-direction: column;
    gap: 0.16rem; /* 16px */
  }
  
  .prev-article,
  .next-article {
    max-width: 100%;
  }
}
</style>
