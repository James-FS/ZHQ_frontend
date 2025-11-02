zhq/                      # 项目根
├─ src/
│  ├─ pages/                   # 页面（pages.json 里注册）
│  │  ├─ pages.json
│  │  │  └─ index.vue
│  │  ├─ user/
│  │  │  └─ profile.vue
│  │  │
│  │  │
│  ├─ components/              # 全局组件
│  ├─ utils/                   # 复用函数
│  ├─ static                   # 纯静态资源（图片、字体、json）
│  ├─ store/                   # 跨页面状态存储
│  ├─ App.vue                  # 根组件（全局样式、onLaunch）
│  ├─ main.js                  # 入口（createApp、插件注册）
│  └─ uni.scss                 # 全局 SCSS 变量、mixin
├─ .gitignore
├─ package.json
├─ vite.config.js              #  Vite 配置