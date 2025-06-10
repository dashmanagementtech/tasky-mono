import { ElMessage } from 'element-plus'
import { createRouter, createWebHistory } from 'vue-router'

import { useAppStore } from '@/stores/app'

const routeModules = import.meta.glob('@/features/**/route/index.ts', { eager: true })

const routes = []

for (const path in routeModules) {
  const mod = routeModules[path] as any
  if (Array.isArray(mod.default)) {
    routes.push(...mod.default)
  }
  else if (mod.default) {
    routes.push(mod.default)
  }
}

function routerGuard(to: any, from: any, next: any) {
  const appstore = useAppStore()

  if (to.meta.protected) {
    if (appstore.token === undefined) {
      ElMessage.warning('You need to login to continue')
      next('/')
    } else {
      next()
    }
  } else {
    next()
  }
}

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

router.beforeEach((to, from, next) => routerGuard(to, from, next))

export default router
