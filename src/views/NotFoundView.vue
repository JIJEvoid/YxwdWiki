<template>
  <main-layout title="页面未找到">
    <div class="not-found-view">
      <div class="not-found-content">
        <div class="error-code">404</div>
        <h1>页面未找到</h1>
        <p>您访问的页面不存在或已被移除</p>
        
        <div class="action-buttons">
          <van-button 
            type="primary" 
            size="normal" 
            @click="goBack"
          >
            返回上一页
          </van-button>
          
          <van-button 
            plain 
            type="primary" 
            size="normal" 
            to="/"
          >
            返回首页
          </van-button>
        </div>
        
        <div class="search-section">
          <p>或者尝试搜索：</p>
          <van-search
            v-model="searchQuery"
            placeholder="搜索文档..."
            shape="round"
            @search="onSearch"
          />
        </div>
      </div>
    </div>
  </main-layout>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import { useRouter } from 'vue-router'
import MainLayout from '@/layouts/MainLayout.vue'
import { Button, Search } from 'vant'

export default defineComponent({
  name: 'NotFoundView',
  components: {
    MainLayout,
    VanButton: Button,
    VanSearch: Search
  },
  setup() {
    const router = useRouter()
    const searchQuery = ref('')
    
    const goBack = () => {
      router.back()
    }
    
    const onSearch = () => {
      if (!searchQuery.value.trim()) return
      
      router.push({
        path: '/search',
        query: { q: searchQuery.value }
      })
    }
    
    return {
      searchQuery,
      goBack,
      onSearch
    }
  }
})
</script>

<style scoped>
.not-found-view {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 70vh;
  padding: 0.16rem; /* 16px */
}

.not-found-content {
  text-align: center;
  max-width: 5rem; /* 500px */
}

.error-code {
  font-size: 0.8rem; /* 80px */
  font-weight: bold;
  color: var(--primary-color);
  opacity: 0.5;
  margin-bottom: 0.16rem; /* 16px */
}

.not-found-content h1 {
  margin-bottom: 0.16rem; /* 16px */
}

.not-found-content p {
  color: color-mix(in srgb, var(--text-color) 80%, transparent);
  margin-bottom: 0.24rem; /* 24px */
}

.action-buttons {
  display: flex;
  justify-content: center;
  gap: 0.16rem; /* 16px */
  margin-bottom: 0.3rem; /* 30px */
}

.search-section {
  margin-top: 0.3rem; /* 30px */
}

.search-section p {
  margin-bottom: 0.12rem; /* 12px */
}

/* 响应式调整 */
@media (max-width: 750px) {
  .action-buttons {
    flex-direction: column;
    gap: 0.12rem; /* 12px */
  }
}
</style>
