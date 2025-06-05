<template>
  <main-layout title="设置">
    <div class="settings-view">
      <h1>设置</h1>
      
      <div class="settings-section">
        <h2>外观</h2>
        <div class="setting-item">
          <span class="setting-label">暗色模式</span>
          <van-switch v-model="isDarkMode" size="24" @change="toggleTheme" />
        </div>
        
        <div class="setting-item">
          <span class="setting-label">字体大小</span>
          <div class="font-size-slider">
            <span class="font-size-label small">小</span>
            <van-slider
              v-model="fontSize"
              :min="80"
              :max="120"
              :step="10"
              @change="changeFontSize"
            />
            <span class="font-size-label large">大</span>
          </div>
        </div>
      </div>
      
      <div class="settings-section">
        <h2>内容</h2>
        <div class="setting-item">
          <span class="setting-label">显示文章更新时间</span>
          <van-switch v-model="showUpdateTime" @change="saveContentSettings" />
        </div>
        
        <div class="setting-item">
          <span class="setting-label">显示文章标签</span>
          <van-switch v-model="showTags" @change="saveContentSettings" />
        </div>
      </div>
      
      <div class="settings-section">
        <h2>缓存</h2>
        <div class="setting-item">
          <span class="setting-label">离线模式</span>
          <van-switch v-model="offlineMode" @change="toggleOfflineMode" />
        </div>
        
        <div class="setting-item">
          <span class="setting-label">缓存大小</span>
          <span class="cache-size">{{ cacheSize }}</span>
        </div>
        
        <van-button 
          type="danger" 
          size="small" 
          class="clear-cache-btn"
          @click="clearCache"
        >
          清除缓存
        </van-button>
      </div>
      
      <div class="settings-section">
        <h2>关于</h2>
        <div class="about-info">
          <p><strong>YxwdWiki</strong> v1.0.0</p>
          <p>一个现代化的移动端 Wiki 文档网站</p>
          <p>基于 Vue3、TypeScript 和 Vite 构建</p>
        </div>
      </div>
    </div>
  </main-layout>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue'
import MainLayout from '@/layouts/MainLayout.vue'
import { useThemeStore } from '@/stores/theme'
import { Switch, Slider, Button, Toast } from 'vant'

export default defineComponent({
  name: 'SettingsView',
  components: {
    MainLayout,
    VanSwitch: Switch,
    VanSlider: Slider,
    VanButton: Button
  },
  setup() {
    const themeStore = useThemeStore()
    const isDarkMode = ref(themeStore.isDarkMode)
    const fontSize = ref(100)
    const showUpdateTime = ref(true)
    const showTags = ref(true)
    const offlineMode = ref(false)
    const cacheSize = ref('0 MB')
    
    // 切换主题
    const toggleTheme = () => {
      themeStore.toggleTheme()
    }
    
    // 更改字体大小
    const changeFontSize = (value: number) => {
      document.documentElement.style.fontSize = `${value}px`
      localStorage.setItem('fontSize', value.toString())
    }
    
    // 保存内容设置
    const saveContentSettings = () => {
      localStorage.setItem('showUpdateTime', showUpdateTime.value.toString())
      localStorage.setItem('showTags', showTags.value.toString())
      Toast('设置已保存')
    }
    
    // 切换离线模式
    const toggleOfflineMode = () => {
      localStorage.setItem('offlineMode', offlineMode.value.toString())
      if (offlineMode.value) {
        Toast('离线模式已启用，内容将被缓存')
      } else {
        Toast('离线模式已禁用')
      }
    }
    
    // 清除缓存
    const clearCache = async () => {
      try {
        // 清除localStorage中的缓存数据
        localStorage.removeItem('wiki_articles')
        localStorage.removeItem('wiki_categories')
        
        // 如果支持Service Worker缓存API
        if ('caches' in window) {
          const cacheKeys = await window.caches.keys()
          await Promise.all(
            cacheKeys.map(key => window.caches.delete(key))
          )
        }
        
        Toast('缓存已清除')
        cacheSize.value = '0 MB'
      } catch (error) {
        console.error('清除缓存失败:', error)
        Toast('清除缓存失败')
      }
    }
    
    // 计算缓存大小
    const calculateCacheSize = () => {
      let size = 0
      
      // 计算localStorage大小
      for (const key in localStorage) {
        if (localStorage.hasOwnProperty(key)) {
          size += localStorage[key].length * 2 // UTF-16 字符占用2字节
        }
      }
      
      // 转换为MB
      const sizeInMB = (size / (1024 * 1024)).toFixed(2)
      cacheSize.value = `${sizeInMB} MB`
    }
    
    onMounted(() => {
      // 加载保存的设置
      const savedFontSize = localStorage.getItem('fontSize')
      if (savedFontSize) {
        fontSize.value = parseInt(savedFontSize)
        document.documentElement.style.fontSize = `${fontSize.value}px`
      }
      
      const savedShowUpdateTime = localStorage.getItem('showUpdateTime')
      if (savedShowUpdateTime) {
        showUpdateTime.value = savedShowUpdateTime === 'true'
      }
      
      const savedShowTags = localStorage.getItem('showTags')
      if (savedShowTags) {
        showTags.value = savedShowTags === 'true'
      }
      
      const savedOfflineMode = localStorage.getItem('offlineMode')
      if (savedOfflineMode) {
        offlineMode.value = savedOfflineMode === 'true'
      }
      
      // 计算缓存大小
      calculateCacheSize()
    })
    
    return {
      isDarkMode,
      fontSize,
      showUpdateTime,
      showTags,
      offlineMode,
      cacheSize,
      toggleTheme,
      changeFontSize,
      saveContentSettings,
      toggleOfflineMode,
      clearCache
    }
  }
})
</script>

<style scoped>
.settings-view {
  padding: 0.16rem 0; /* 16px */
}

.settings-view h1 {
  margin-bottom: 0.24rem; /* 24px */
}

.settings-section {
  margin-bottom: 0.3rem; /* 30px */
  background-color: var(--card-bg);
  border-radius: 0.08rem; /* 8px */
  padding: 0.16rem; /* 16px */
}

.settings-section h2 {
  margin-top: 0;
  margin-bottom: 0.16rem; /* 16px */
  font-size: 0.18rem; /* 18px */
  position: relative;
  padding-left: 0.12rem; /* 12px */
}

.settings-section h2::before {
  content: '';
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 0.04rem; /* 4px */
  height: 0.16rem; /* 16px */
  background-color: var(--primary-color);
  border-radius: 0.02rem; /* 2px */
}

.setting-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.12rem 0; /* 12px */
  border-bottom: 1px solid var(--border-color);
}

.setting-item:last-child {
  border-bottom: none;
}

.setting-label {
  font-size: 0.16rem; /* 16px */
}

.font-size-slider {
  display: flex;
  align-items: center;
  width: 60%;
}

.font-size-label {
  font-size: 0.14rem; /* 14px */
  color: color-mix(in srgb, var(--text-color) 70%, transparent);
  margin: 0 0.08rem; /* 8px */
}

.font-size-label.small {
  font-size: 0.12rem; /* 12px */
}

.font-size-label.large {
  font-size: 0.16rem; /* 16px */
}

.cache-size {
  font-size: 0.14rem; /* 14px */
  color: color-mix(in srgb, var(--text-color) 70%, transparent);
}

.clear-cache-btn {
  margin-top: 0.16rem; /* 16px */
}

.about-info {
  padding: 0.08rem 0; /* 8px */
}

.about-info p {
  margin: 0.08rem 0; /* 8px */
  font-size: 0.14rem; /* 14px */
}
</style>
