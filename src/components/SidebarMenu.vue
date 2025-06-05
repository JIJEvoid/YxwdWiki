<template>
  <div class="sidebar-menu">
    <div class="sidebar-header">
      <div class="logo">YxwdWiki</div>
      <van-icon 
        v-if="isMobile" 
        name="cross" 
        size="24" 
        class="close-icon" 
        @click="$emit('close')" 
      />
    </div>
    
    <div class="sidebar-content">
      <div class="user-info">
        <div class="theme-switch">
          <span>{{ isDarkMode ? '暗色模式' : '亮色模式' }}</span>
          <van-switch v-model="isDarkMode" size="24" @change="toggleTheme" />
        </div>
      </div>
      
      <div class="menu-title">目录</div>
      
      <div class="menu-items">
        <div 
          v-for="category in rootCategories" 
          :key="category.id" 
          class="menu-item"
        >
          <router-link 
            :to="`/category/${category.id}`" 
            class="menu-link"
            :class="{ active: isActiveCategory(category.id) }"
          >
            {{ category.title }}
          </router-link>
          
          <div 
            v-if="hasSubcategories(category.id)" 
            class="submenu"
          >
            <router-link 
              v-for="subCategory in getSubcategories(category.id)" 
              :key="subCategory.id"
              :to="`/category/${subCategory.id}`"
              class="submenu-link"
              :class="{ active: isActiveCategory(subCategory.id) }"
            >
              {{ subCategory.title }}
            </router-link>
          </div>
        </div>
      </div>
    </div>
    
    <div class="sidebar-footer">
      <router-link to="/settings" class="settings-link">
        <van-icon name="setting-o" size="18" />
        <span>设置</span>
      </router-link>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed, ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useWikiStore } from '@/stores/wiki'
import { useThemeStore } from '@/stores/theme'
import { Icon, Switch } from 'vant'

export default defineComponent({
  name: 'SidebarMenu',
  components: {
    VanIcon: Icon,
    VanSwitch: Switch
  },
  emits: ['close'],
  setup(props, { emit }) {
    const route = useRoute()
    const wikiStore = useWikiStore()
    const themeStore = useThemeStore()
    const isMobile = ref(window.innerWidth < 750)
    const isDarkMode = computed(() => themeStore.isDarkMode)
    
    const rootCategories = computed(() => {
      return wikiStore.getCategoriesByParentId(null)
    })
    
    const hasSubcategories = (categoryId: string) => {
      return wikiStore.getCategoriesByParentId(categoryId).length > 0
    }
    
    const getSubcategories = (categoryId: string) => {
      return wikiStore.getCategoriesByParentId(categoryId)
    }
    
    const isActiveCategory = (categoryId: string) => {
      return route.params.categoryId === categoryId
    }
    
    const toggleTheme = () => {
      themeStore.toggleTheme()
    }
    
    const checkMobile = () => {
      isMobile.value = window.innerWidth < 750
    }
    
    onMounted(() => {
      window.addEventListener('resize', checkMobile)
      // 确保数据已加载
      if (wikiStore.categories.length === 0) {
        wikiStore.loadData()
      }
    })
    
    return {
      isMobile,
      isDarkMode,
      rootCategories,
      hasSubcategories,
      getSubcategories,
      isActiveCategory,
      toggleTheme
    }
  }
})
</script>

<style scoped>
.sidebar-menu {
  display: flex;
  flex-direction: column;
  height: 100%;
  background-color: var(--bg-color);
  color: var(--text-color);
}

.sidebar-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.16rem; /* 16px */
  border-bottom: 1px solid var(--border-color);
}

.logo {
  font-size: 0.2rem; /* 20px */
  font-weight: bold;
  color: var(--primary-color);
}

.close-icon {
  cursor: pointer;
}

.sidebar-content {
  flex: 1;
  overflow-y: auto;
  padding: 0.16rem; /* 16px */
}

.user-info {
  margin-bottom: 0.2rem; /* 20px */
  padding-bottom: 0.16rem; /* 16px */
  border-bottom: 1px solid var(--border-color);
}

.theme-switch {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.menu-title {
  font-size: 0.16rem; /* 16px */
  font-weight: bold;
  margin-bottom: 0.12rem; /* 12px */
  color: var(--text-color);
}

.menu-items {
  display: flex;
  flex-direction: column;
  gap: 0.08rem; /* 8px */
}

.menu-item {
  display: flex;
  flex-direction: column;
}

.menu-link {
  display: block;
  padding: 0.1rem 0; /* 10px */
  color: var(--text-color);
  text-decoration: none;
  font-size: 0.16rem; /* 16px */
  border-radius: 0.04rem; /* 4px */
  transition: background-color 0.2s;
}

.menu-link:hover, .submenu-link:hover {
  background-color: color-mix(in srgb, var(--primary-color) 10%, transparent);
}

.menu-link.active {
  color: var(--primary-color);
  font-weight: bold;
}

.submenu {
  margin-left: 0.16rem; /* 16px */
  display: flex;
  flex-direction: column;
  gap: 0.04rem; /* 4px */
}

.submenu-link {
  display: block;
  padding: 0.08rem 0.12rem; /* 8px 12px */
  color: var(--text-color);
  text-decoration: none;
  font-size: 0.14rem; /* 14px */
  border-radius: 0.04rem; /* 4px */
  transition: background-color 0.2s;
}

.submenu-link.active {
  color: var(--primary-color);
  font-weight: bold;
}

.sidebar-footer {
  padding: 0.16rem; /* 16px */
  border-top: 1px solid var(--border-color);
}

.settings-link {
  display: flex;
  align-items: center;
  gap: 0.08rem; /* 8px */
  color: var(--text-color);
  text-decoration: none;
}
</style>
