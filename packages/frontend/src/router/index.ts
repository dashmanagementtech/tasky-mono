import { createRouter, createWebHistory } from 'vue-router'
import authRoutes from '@/features/Auth/route'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    ...authRoutes
  ],
})

export default router
