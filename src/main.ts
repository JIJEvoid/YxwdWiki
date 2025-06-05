import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import './styles/main.css'

// Import Vant
import { Lazyload } from 'vant'
import '@vant/touch-emulator' // Enable touch events on desktop

// Dynamic set rem unit for mobile adaptation
function setRemUnit() {
  const designWidth = 750 // Design width
  const rootFontSize = 100 // Base font size
  const clientWidth = document.documentElement.clientWidth
  const maxWidth = 750 // Max content width
  
  // Limit the maximum width for larger screens
  const width = clientWidth > maxWidth ? maxWidth : clientWidth
  document.documentElement.style.fontSize = (width / designWidth) * rootFontSize + 'px'
}

// Initialize and listen for window resize
setRemUnit()
window.addEventListener('resize', setRemUnit)

// Create Vue app
const app = createApp(App)

// Use plugins
app.use(createPinia())
app.use(router)
app.use(Lazyload, {
  lazyComponent: true,
  loading: '/src/assets/loading.svg',
  error: '/src/assets/error.svg'
})

// Mount app
app.mount('#app')
