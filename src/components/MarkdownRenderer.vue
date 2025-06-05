<template>
  <div class="markdown-renderer markdown-content" ref="contentRef"></div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, watch, nextTick } from 'vue'
import MarkdownIt from 'markdown-it'
import Prism from 'prismjs'
import 'prismjs/components/prism-javascript'
import 'prismjs/components/prism-typescript'
import 'prismjs/components/prism-css'
import 'prismjs/components/prism-markup'
import 'prismjs/components/prism-bash'
import 'prismjs/components/prism-json'

export default defineComponent({
  name: 'MarkdownRenderer',
  props: {
    content: {
      type: String,
      required: true
    }
  },
  setup(props) {
    const contentRef = ref<HTMLElement | null>(null)
    const md = new MarkdownIt({
      html: true,
      linkify: true,
      typographer: true,
      highlight: (str, lang) => {
        if (lang && Prism.languages[lang]) {
          try {
            return `<pre class="language-${lang}"><code>${Prism.highlight(str, Prism.languages[lang], lang)}</code></pre>`
          } catch (e) {
            console.error(e)
          }
        }
        return `<pre class="language-text"><code>${md.utils.escapeHtml(str)}</code></pre>`
      }
    })

    // 渲染Markdown内容
    const renderContent = () => {
      if (contentRef.value && props.content) {
        contentRef.value.innerHTML = md.render(props.content)
        
        // 处理内部链接
        const links = contentRef.value.querySelectorAll('a')
        links.forEach(link => {
          if (link.getAttribute('href')?.startsWith('#')) {
            link.addEventListener('click', (e) => {
              e.preventDefault()
              const targetId = link.getAttribute('href')?.substring(1)
              const targetElement = document.getElementById(targetId || '')
              if (targetElement) {
                targetElement.scrollIntoView({ behavior: 'smooth' })
              }
            })
          }
        })
        
        // 添加目录锚点
        const headings = contentRef.value.querySelectorAll('h1, h2, h3, h4, h5, h6')
        headings.forEach(heading => {
          const id = heading.textContent?.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '') || ''
          heading.id = id
        })
        
        // 代码高亮
        nextTick(() => {
          Prism.highlightAllUnder(contentRef.value as HTMLElement)
        })
      }
    }

    onMounted(() => {
      renderContent()
    })

    watch(() => props.content, () => {
      renderContent()
    })

    return {
      contentRef
    }
  }
})
</script>

<style>
.markdown-renderer {
  width: 100%;
}

/* 代码高亮样式 */
pre[class*="language-"] {
  background-color: var(--card-bg);
  border-radius: 0.04rem; /* 4px */
  padding: 0.16rem; /* 16px */
  margin: 0.16rem 0; /* 16px */
  overflow-x: auto;
}

code[class*="language-"] {
  font-family: 'Courier New', Courier, monospace;
  font-size: 0.14rem; /* 14px */
}

/* 暗色模式下的代码高亮 */
.dark pre[class*="language-"] {
  background-color: #1a1a1a;
}

/* 表格样式 */
.markdown-renderer table {
  width: 100%;
  border-collapse: collapse;
  margin: 0.2rem 0; /* 20px */
}

.markdown-renderer th,
.markdown-renderer td {
  border: 1px solid var(--border-color);
  padding: 0.08rem 0.12rem; /* 8px 12px */
}

.markdown-renderer th {
  background-color: color-mix(in srgb, var(--card-bg) 90%, black);
}

/* 图片样式 */
.markdown-renderer img {
  max-width: 100%;
  height: auto;
  border-radius: 0.04rem; /* 4px */
}

/* 引用样式 */
.markdown-renderer blockquote {
  border-left: 0.04rem solid var(--primary-color); /* 4px */
  padding-left: 0.16rem; /* 16px */
  margin-left: 0;
  color: color-mix(in srgb, var(--text-color) 80%, transparent);
}
</style>
