<template>
  <div class="app-container" :class="{ 'dark': isDarkMode }">
    <router-view v-slot="{ Component }">
      <transition name="fade" mode="out-in">
        <component :is="Component" />
      </transition>
    </router-view>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useThemeStore } from './stores/theme'

export default defineComponent({
  name: 'App',
  setup() {
    const route = useRoute()
    const themeStore = useThemeStore()
    const isDarkMode = ref(themeStore.isDarkMode)

    // Watch for theme changes
    watch(() => themeStore.isDarkMode, (newValue) => {
      isDarkMode.value = newValue
    })

    // Set page title based on route
    watch(() => route.meta.title, (title) => {
      if (title) {
        document.title = `${title} - YxwdWiki`
      } else {
        document.title = 'YxwdWiki'
      }
    }, { immediate: true })

    onMounted(() => {
      // Initialize theme from local storage or system preference
      themeStore.initTheme()
    })

    return {
      isDarkMode
    }
  }
})
</script>

<style>
.app-container {
  width: 100%;
  min-height: 100vh;
  background-color: var(--bg-color);
  color: var(--text-color);
  transition: background-color 0.3s, color 0.3s;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Center content on desktop */
@media (min-width: 750px) {
  .app-container {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
}
</style>
