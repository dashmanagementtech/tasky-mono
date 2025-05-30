import type { RouteRecordRaw } from 'vue-router';

const authRoutes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'login',
    component: () => import('../view/Login.vue'),
    meta: {
      layout: 'auth'
    }
  },
  {
    path: '/accept-invite',
    name: 'accept-invite',
    component: () => import('../view/AcceptInvite.vue'),
    meta: {
      layout: 'auth'
    }
  },
  {
    path: '/login',
    redirect: '/'
  }
]

export default authRoutes;
