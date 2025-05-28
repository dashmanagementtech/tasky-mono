import { createRouter, createWebHistory } from 'vue-router'

const routeModules = import.meta.glob('@/features/**/route/index.ts', { eager: true })

const routes = []

for (const path in routeModules) {
  const mod = routeModules[path] as any
  if (Array.isArray(mod.default)) {
    routes.push(...mod.default)
  } else if (mod.default) {
    routes.push(mod.default)
  }
}

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

export default router
