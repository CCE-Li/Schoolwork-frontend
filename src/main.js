import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

// 引入图标字体
import './assets/iconfont/iconfont.css'

const app = createApp(App)

app.use(createPinia())
app.use(router)

app.mount('#app')