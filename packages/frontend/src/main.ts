import { createPinia } from 'pinia'
import { createPersistedState } from 'pinia-plugin-persistedstate'
import { createApp } from 'vue'

import App from './App.vue'
import router from './router'
import 'reflect-metadata'

import './assets/main.css'
import 'element-plus/es/components/message/style/css'
import 'element-plus/es/components/message-box/style/css'

const app = createApp(App)
const pinia = createPinia()

pinia.use(createPersistedState({
  storage: sessionStorage,
  auto: true
}))

app.use(pinia)
app.use(router)

app.mount('#app')
