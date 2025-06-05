<template>
  <div class="main-layout">
    <!-- 移动端导航栏 -->
    <div class="mobile-header" v-if="isMobile">
      <div class="header-left">
        <van-icon name="wap-nav" size="24" @click="showSidebar = true" />
      </div>
      <div class="header-title">{{ title }}</div>
      <div class="header-right">
        <van-icon name="search" size="24" @click="goToSearch" />
      </div>
    </div>

    <!-- PC端导航栏 -->
    <div class="desktop-header" v-else>
      <div class="header-logo">YxwdWiki</div>
      <div class="header-title">{{ title }}</div>
      <div class="header-actions">
        <van-search
          v-model="searchQuery"
          placeholder="搜索文档..."
          shape="round"
          @search="onSearch"
        />
        <van-icon name="setting-o" size="24" class="setting-icon" @click="goToSettings" />
        <van-switch v-model="isDarkMode" size="24" @change="toggleTheme" />
      </div>
    </div>

    <!-- 移动端侧边栏 -->
    <van-popup
      v-model:show="showSidebar"
      position="left"
      :style="{ width: '70%', height: '100%' }"
    >
      <sidebar-menu @close="showSidebar = false" />
    </van-popup>

    <!-- 主内容区 -->
    <div class="main-content" :class="{ 'desktop': !isMobile }">
      <div class="content-container">
        <!-- PC端侧边栏 -->
        <div class="desktop-sidebar" v-if="!isMobile">
          <sidebar-menu />
        </div>

        <!-- 页面内容 -->
        <div class="page-content">
          <slot></slot>
        </div>
      </div>
    </div>

    <!-- 移动端底部导航 -->
    <div class="mobile-footer" v-if="isMobile">
      <van-tabbar v-model="activeTab" route>
        <van-tabbar-item icon="home-o" to="/">首页</van-tabbar-item>
        <van-tabbar-item icon="search" to="/search">搜索</van-tabbar-item>
        <van-tabbar-item icon="setting-o" to="/settings">设置</van-tabbar-item>
      </van-tabbar>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useThemeStore } from '@/stores/theme'
import SidebarMenu from '@/components/SidebarMenu.vue'
import { Icon, Popup, Search, Switch, Tabbar, TabbarItem } from 'vant'

export default defineComponent({
  name: 'MainLayout',
  components: {
    SidebarMenu,
    VanIcon: Icon,
    VanPopup: Popup,
    VanSearch: Search,
    VanSwitch: Switch,
    VanTabbar: Tabbar,
    VanTabbarItem: TabbarItem
  },
  props: {
    title: {
      type: String,
      default: 'YxwdWiki'
    }
  },
  setup(props) {
    const router = useRouter()
    const themeStore = useThemeStore()
    const showSidebar = ref(false)
    const searchQuery = ref('')
    const activeTab = ref(0)
    const isMobile = ref(window.innerWidth < 750)
    const isDarkMode = computed(() => themeStore.isDarkMode)

    const checkMobile = () => {
      isMobile.value = window.innerWidth < 750
    }

    const toggleTheme = () => {
      themeStore.toggleTheme()
    }

    const goToSearch = () => {
      router.push('/search')
    }

    const goToSettings = () => {
      router.push('/settings')
    }

    const onSearch = () => {
      router.push({
        path: '/search',
        query: { q: searchQuery.value }
      })
      searchQuery.value = ''
    }

    onMounted(() => {
      window.addEventListener('resize', checkMobile)
    })

    onUnmounted(() => {
      window.removeEventListener('resize', checkMobile)
    })

    return {
      showSidebar,
      searchQuery,
      activeTab,
      isMobile,
      isDarkMode,
      toggleTheme,
      goToSearch,
      goToSettings,
      onSearch
    }
  }
})
</script>

<style scoped>
.main-layout {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  width: 100%;
}

/* 移动端样式 */
.mobile-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 50px;
  padding: 0 16px;
  background-color: var(--bg-color);
  border-bottom: 1px solid var(--border-color);
  position: sticky;
  top: 0;
  z-index: 10;
}

.header-title {
  font-size: 18px;
  font-weight: bold;
}

.mobile-footer {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 10;
}

/* PC端样式 */
.desktop-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 60px;
  padding: 0 20px;
  background-color: var(--bg-color);
  border-bottom: 1px solid var(--border-color);
  position: sticky;
  top: 0;
  z-index: 10;
  width: 100%;
  max-width: 750px;
  margin: 0 auto;
}

.header-logo {
  font-size: 24px;
  font-weight: bold;
  color: var(--primary-color);
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 20px;
}

.setting-icon {
  cursor: pointer;
}

/* 内容区样式 */
.main-content {
  flex: 1;
  padding: 16px;
  overflow-y: auto;
}

.main-content.desktop {
  padding: 20px;
}

.content-container {
  display: flex;
  max-width: 750px;
  margin: 0 auto;
  height: 100%;
}

.desktop-sidebar {
  width: 200px;
  padding-right: 20px;
  border-right: 1px solid var(--border-color);
  height: 100%;
}

.page-content {
  flex: 1;
  padding: 0 20px;
}
</style>
