<template>
  <main-layout title="搜索">
    <div class="search-view">
      <div class="search-header">
        <van-search
          v-model="searchQuery"
          placeholder="搜索文档..."
          shape="round"
          show-action
          @search="onSearch"
          @cancel="onCancel"
        />
      </div>
      
      <div class="search-results" v-if="hasSearched">
        <template v-if="isSearching">
          <div class="loading-state">
            <van-loading type="spinner" color="var(--primary-color)" />
            <p>搜索中...</p>
          </div>
        </template>
        
        <template v-else-if="hasResults">
          <div class="result-stats">
            找到 {{ totalResults }} 个结果
          </div>
          
          <!-- 分类结果 -->
          <div class="result-section" v-if="matchedCategories.length > 0">
            <h2>分类</h2>
            <div class="category-results">
              <router-link
                v-for="category in matchedCategories"
                :key="category.id"
                :to="`/category/${category.id}`"
                class="category-result-item"
              >
                <h3>{{ category.title }}</h3>
                <p>{{ category.description }}</p>
              </router-link>
            </div>
          </div>
          
          <!-- 文章结果 -->
          <div class="result-section" v-if="matchedArticles.length > 0">
            <h2>文章</h2>
            <div class="article-results">
              <router-link
                v-for="article in matchedArticles"
                :key="article.id"
                :to="`/article/${article.id}`"
                class="article-result-item"
              >
                <div class="article-title">{{ article.title }}</div>
                <div class="article-preview">{{ getArticlePreview(article) }}</div>
                <div class="article-meta">
                  <div class="article-tags">
                    <span v-for="(tag, index) in article.tags" :key="index" class="article-tag">
                      {{ tag }}
                    </span>
                  </div>
                </div>
              </router-link>
            </div>
          </div>
        </template>
        
        <template v-else>
          <div class="empty-state">
            <van-empty description="未找到相关内容" />
            <p>尝试使用不同的关键词搜索</p>
          </div>
        </template>
      </div>
      
      <div class="search-tips" v-else>
        <h2>搜索提示</h2>
        <ul>
          <li>输入关键词搜索文章和分类</li>
          <li>可以使用标签名称进行搜索</li>
          <li>搜索结果将按相关性排序</li>
        </ul>
        
        <div class="hot-tags">
          <h3>热门标签</h3>
          <div class="tags-list">
            <span 
              v-for="(tag, index) in hotTags" 
              :key="index" 
              class="hot-tag"
              @click="searchByTag(tag)"
            >
              {{ tag }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </main-layout>
</template>

<script lang="ts">
import { defineComponent, ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import MainLayout from '@/layouts/MainLayout.vue'
import { useWikiStore } from '@/stores/wiki'
import { Search, Loading, Empty } from 'vant'

export default defineComponent({
  name: 'SearchView',
  components: {
    MainLayout,
    VanSearch: Search,
    VanLoading: Loading,
    VanEmpty: Empty
  },
  setup() {
    const route = useRoute()
    const router = useRouter()
    const wikiStore = useWikiStore()
    
    const searchQuery = ref('')
    const isSearching = ref(false)
    const hasSearched = ref(false)
    const matchedCategories = ref<any[]>([])
    const matchedArticles = ref<any[]>([])
    
    const hotTags = computed(() => {
      // 获取所有文章的标签并去重
      const allTags = wikiStore.articles.flatMap(article => article.tags)
      const uniqueTags = [...new Set(allTags)]
      // 返回前10个标签
      return uniqueTags.slice(0, 10)
    })
    
    const hasResults = computed(() => {
      return matchedCategories.value.length > 0 || matchedArticles.value.length > 0
    })
    
    const totalResults = computed(() => {
      return matchedCategories.value.length + matchedArticles.value.length
    })
    
    // 从URL查询参数初始化搜索
    const initFromQuery = () => {
      const queryParam = route.query.q
      if (queryParam && typeof queryParam === 'string') {
        searchQuery.value = queryParam
        onSearch()
      }
    }
    
    // 执行搜索
    const onSearch = () => {
      if (!searchQuery.value.trim()) return
      
      isSearching.value = true
      hasSearched.value = true
      
      // 更新URL，但不触发路由变化
      router.replace({ 
        path: '/search', 
        query: { q: searchQuery.value } 
      })
      
      // 模拟搜索延迟
      setTimeout(() => {
        const results = wikiStore.search(searchQuery.value)
        matchedCategories.value = results.matchedCategories
        matchedArticles.value = results.matchedArticles
        isSearching.value = false
      }, 300)
    }
    
    const onCancel = () => {
      searchQuery.value = ''
      hasSearched.value = false
      router.replace({ path: '/search' })
    }
    
    const searchByTag = (tag: string) => {
      searchQuery.value = tag
      onSearch()
    }
    
    const getArticlePreview = (article: any) => {
      // 从Markdown内容中提取纯文本预览
      const plainText = article.content
        .replace(/#+\s+/g, '') // 移除标题标记
        .replace(/\*\*|__/g, '') // 移除粗体标记
        .replace(/\*|_/g, '') // 移除斜体标记
        .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // 将链接替换为链接文本
        .replace(/```[\s\S]*?```/g, '') // 移除代码块
        .replace(/`([^`]+)`/g, '$1') // 移除行内代码
      
      // 返回前100个字符作为预览
      return plainText.substring(0, 100) + (plainText.length > 100 ? '...' : '')
    }
    
    // 监听路由变化，更新搜索
    watch(() => route.query.q, () => {
      initFromQuery()
    })
    
    onMounted(() => {
      if (wikiStore.articles.length === 0) {
        wikiStore.loadData()
      }
      
      initFromQuery()
    })
    
    return {
      searchQuery,
      isSearching,
      hasSearched,
      matchedCategories,
      matchedArticles,
      hotTags,
      hasResults,
      totalResults,
      onSearch,
      onCancel,
      searchByTag,
      getArticlePreview
    }
  }
})
</script>

<style scoped>
.search-view {
  padding: 0.16rem 0; /* 16px */
}

.search-header {
  margin-bottom: 0.2rem; /* 20px */
}

.result-stats {
  margin-bottom: 0.16rem; /* 16px */
  color: color-mix(in srgb, var(--text-color) 70%, transparent);
  font-size: 0.14rem; /* 14px */
}

.result-section {
  margin-bottom: 0.3rem; /* 30px */
}

.result-section h2 {
  margin-bottom: 0.16rem; /* 16px */
  position: relative;
  padding-left: 0.12rem; /* 12px */
}

.result-section h2::before {
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

.category-results,
.article-results {
  display: flex;
  flex-direction: column;
  gap: 0.12rem; /* 12px */
}

.category-result-item,
.article-result-item {
  background-color: var(--card-bg);
  border-radius: 0.08rem; /* 8px */
  padding: 0.16rem; /* 16px */
  text-decoration: none;
  color: var(--text-color);
  transition: background-color 0.2s;
}

.category-result-item:hover,
.article-result-item:hover {
  background-color: color-mix(in srgb, var(--card-bg) 90%, var(--primary-color));
}

.category-result-item h3 {
  color: var(--primary-color);
  margin-top: 0;
  margin-bottom: 0.08rem; /* 8px */
}

.category-result-item p {
  margin: 0;
  font-size: 0.14rem; /* 14px */
  color: color-mix(in srgb, var(--text-color) 80%, transparent);
}

.article-title {
  font-weight: 500;
  font-size: 0.18rem; /* 18px */
  margin-bottom: 0.08rem; /* 8px */
  color: var(--primary-color);
}

.article-preview {
  font-size: 0.14rem; /* 14px */
  margin-bottom: 0.12rem; /* 12px */
  color: color-mix(in srgb, var(--text-color) 90%, transparent);
  line-height: 1.5;
}

.article-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
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

.search-tips {
  padding: 0.16rem; /* 16px */
  background-color: var(--card-bg);
  border-radius: 0.08rem; /* 8px */
}

.search-tips h2 {
  margin-top: 0;
  margin-bottom: 0.16rem; /* 16px */
}

.search-tips ul {
  padding-left: 0.2rem; /* 20px */
  margin-bottom: 0.2rem; /* 20px */
}

.search-tips li {
  margin-bottom: 0.08rem; /* 8px */
}

.hot-tags {
  margin-top: 0.2rem; /* 20px */
}

.hot-tags h3 {
  margin-bottom: 0.12rem; /* 12px */
}

.tags-list {
  display: flex;
  flex-wrap: wrap;
  gap: 0.08rem; /* 8px */
}

.hot-tag {
  background-color: color-mix(in srgb, var(--primary-color) 20%, transparent);
  color: var(--primary-color);
  padding: 0.04rem 0.12rem; /* 4px 12px */
  border-radius: 0.1rem; /* 10px */
  font-size: 0.14rem; /* 14px */
  cursor: pointer;
  transition: background-color 0.2s;
}

.hot-tag:hover {
  background-color: color-mix(in srgb, var(--primary-color) 30%, transparent);
}

.loading-state,
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 0.5rem 0; /* 50px */
  gap: 0.16rem; /* 16px */
  color: color-mix(in srgb, var(--text-color) 70%, transparent);
}
</style>
