import { createPinia } from 'pinia'
import { createApp } from 'vue'

import App from './App.vue'
import router from './router'
import 'reflect-metadata'

import './assets/main.css'
import 'element-plus/es/components/message/style/css'
import 'element-plus/es/components/message-box/style/css'

const app = createApp(App)

app.use(createPinia())
app.use(router)

app.mount('#app')
