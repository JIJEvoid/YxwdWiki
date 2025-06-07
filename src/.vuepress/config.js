import { defineUserConfig } from "vuepress";
import { hopeTheme } from "vuepress-theme-hope";

export default defineUserConfig({
  base: "/",
  lang: "zh-CN",
  title: "YxwdWiki",
  description: "一个基于VuePress的移动端博客",
  
  theme: hopeTheme({
    // 主题配置
    hostname: "https://example.com",
    
    author: {
      name: "YxwdWiki",
      url: "https://example.com",
    },
    
    iconAssets: "iconfont",
    
    logo: "/logo.png",
    
    repo: "",
    
    docsDir: "src",
    
    // 导航栏
    navbar: [
      "/",
      { text: "文章", icon: "pen-to-square", link: "/posts/" },
      { text: "分类", icon: "folder", link: "/category/" },
      { text: "标签", icon: "tags", link: "/tag/" },
      { text: "关于", icon: "info", link: "/about/" },
    ],
    
    // 侧边栏
    sidebar: {
      "/posts/": "structure",
      "/": ["about", "posts"],
    },
    
    // 页脚
    footer: "默认页脚",
    displayFooter: true,
    
    // 博客配置
    blog: {
      description: "一个博客写作者",
      intro: "/about/",
      medias: {
        // 你可以在这里添加社交媒体链接
        GitHub: "https://github.com",
        Wechat: "https://example.com",
        QQ: "https://example.com",
        Weibo: "https://example.com",
      },
    },
    
    // 加密配置
    encrypt: {
      config: {
        // "/demo/encrypt.html": ["1234"],
      },
    },
    
    // 插件配置
    plugins: {
      blog: true,
      
      // 评论配置
      comment: {
        provider: "Giscus",
        repo: "",
        repoId: "",
        category: "",
        categoryId: "",
      },
      
      // 所有功能都默认启用
      mdEnhance: {
        align: true,
        attrs: true,
        chart: true,
        codetabs: true,
        container: true,
        demo: true,
        echarts: true,
        figure: true,
        flowchart: true,
        gfm: true,
        imgLazyload: true,
        imgSize: true,
        include: true,
        katex: true,
        mark: true,
        mermaid: true,
        playground: {
          presets: ["ts", "vue"],
        },
        presentation: {
          plugins: ["highlight", "math", "search", "notes", "zoom"],
        },
        stylize: [
          {
            matcher: "Recommended",
            replacer: ({ tag }) => {
              if (tag === "em")
                return {
                  tag: "Badge",
                  attrs: { type: "tip" },
                  content: "推荐",
                };
            },
          },
        ],
        sub: true,
        sup: true,
        tabs: true,
        vPre: true,
        vuePlayground: true,
      },
      
      // PWA 支持
      pwa: {
        favicon: "/favicon.ico",
        cacheHTML: true,
        cachePic: true,
        appendBase: true,
        apple: {
          icon: "/img/icon/apple-icon-152.png",
          statusBarColor: "black",
        },
        msTile: {
          image: "/img/icon/ms-icon-144.png",
          color: "#ffffff",
        },
        manifest: {
          icons: [
            {
              src: "/img/icon/chrome-mask-512.png",
              sizes: "512x512",
              purpose: "maskable",
              type: "image/png",
            },
            {
              src: "/img/icon/chrome-mask-192.png",
              sizes: "192x192",
              purpose: "maskable",
              type: "image/png",
            },
            {
              src: "/img/icon/chrome-512.png",
              sizes: "512x512",
              type: "image/png",
            },
            {
              src: "/img/icon/chrome-192.png",
              sizes: "192x192",
              type: "image/png",
            },
          ],
          shortcuts: [
            {
              name: "文章",
              short_name: "文章",
              url: "/posts/",
              icons: [
                {
                  src: "/img/icon/guide-maskable.png",
                  sizes: "192x192",
                  purpose: "maskable",
                  type: "image/png",
                },
              ],
            },
          ],
        },
      },
    },
  }),
});
