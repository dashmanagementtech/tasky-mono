import type { RouteRecordRaw } from 'vue-router';

const clientRoutes: RouteRecordRaw[] = [
  {
    path: '/app/clients',
    meta: {
      layout: 'app',
      parent: '/app/clients',
      acl: [],
      name: 'clients'
    },
    children: [
      {
        path: '',
        name: 'clients',
        component: () => import('../view/Index.vue'),
      }
    ]
  },
]

export default clientRoutes;
