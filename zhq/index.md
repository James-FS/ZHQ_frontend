zhq/                      # 项目根
├─ src/
│  ├─ pages/                   # 页面（pages.json 里注册）
│  │  ├─ pages.json
│  │  │  └─ index.vue
│  │  ├──index                 #首页
│  │  ├──message               #消息页
│  │  ├──square                #广场页
│  │  ├──teaming               #组队页
│  │  ├──user                  #用户主页
│  │  ├─ components/              # 全局组件
│  │
│  │
│  ├─ utils/                   # 复用函数
│  ├─ static/                  # 静态资源（图片、字体、json）
│  │   ├─iconfont              # 阿里图标库
│  │   ├─img                   # 静态图片存储     
│  │    
│  ├─ store/                   # 跨页面状态存储
│  ├─ App.vue                  # 根组件（全局样式、onLaunch）
│  ├─ main.js                  # 入口（createApp、插件注册）
│  
│
│
├─ .gitignore
├─ package.json
├─ vite.config.js              #  Vite 配置


1.尺寸使用rpx而不是px  1rpx = 屏宽/750
