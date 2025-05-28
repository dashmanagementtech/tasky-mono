import type { RouteRecordRaw } from 'vue-router';

const staffRoutes: RouteRecordRaw[] = [
  {
    path: '/app/staff',
    meta: {
      layout: 'app',
      parent: '/app/staff',
      acl: [],
      name: 'staff'
    },
    children: [
      {
        path: '',
        name: 'staff',
        component: () => import('../view/Index.vue'),
      }
    ]
  },
]

export default staffRoutes;
