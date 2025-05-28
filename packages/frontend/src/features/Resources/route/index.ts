import type { RouteRecordRaw } from 'vue-router';

const resourceRoutes: RouteRecordRaw[] = [
  {
    path: '/app/resources',
    meta: {
      layout: 'app',
      parent: '/app/resources',
      acl: [],
      name: 'resources'
    },
    children: [
      {
        path: '',
        name: 'resources',
        component: () => import('../view/Index.vue'),
      }
    ]
  },
]

export default resourceRoutes;
