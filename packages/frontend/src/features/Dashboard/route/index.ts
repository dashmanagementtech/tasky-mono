import type { RouteRecordRaw } from 'vue-router';

const dashboardRoutes: RouteRecordRaw[] = [
  {
    path: '/app/dashboard',
    name: 'dashboard',
    component: () => import('../view/Index.vue'),
    meta: {
      layout: 'app',
      parent: '/app/dashboard',
      name: 'dashboard',
      protected: true
    }
  },
]

export default dashboardRoutes;
