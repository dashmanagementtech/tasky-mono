import type { RouteRecordRaw } from 'vue-router';

const staffRoutes: RouteRecordRaw[] = [
  {
    path: '/app/staff',
    meta: {
      layout: 'app',
      parent: '/app/staff',
      acl: [],
      name: 'staff',
      protected: true
    },
    children: [
      {
        path: '',
        name: 'staff',
        component: () => import('../view/Index.vue'),
      },
      {
        path: 'invite',
        component: () => import('../view/Index.vue'),
        children: [
          {
            path: '',
            name: 'invite-staff',
            component: () => import('../view/InviteStaff.vue'),
          }
        ]
      }
    ]
  },
]

export default staffRoutes;
