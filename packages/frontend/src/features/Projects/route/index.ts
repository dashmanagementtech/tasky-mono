import type { RouteRecordRaw } from 'vue-router';

const projectRoutes: RouteRecordRaw[] = [
  {
    path: '/app/projects',
    meta: {
      layout: 'app',
      parent: '/app/projects',
      acl: [],
      name: 'projects'
    },
    children: [
      {
        path: '',
        name: 'projects',
        component: () => import('../view/Index.vue'),
      }
    ]
  },
]

export default projectRoutes;
