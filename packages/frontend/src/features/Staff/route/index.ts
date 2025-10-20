import type { RouteRecordRaw } from 'vue-router';

const staffRoutes: RouteRecordRaw[] = [
  {
    path: '/app/staff',
    meta: {
      layout: 'app',
      parent: '/app/staff',
      meta: {
        acl: ['ADMIN', 'SUPER_ADMIN']
      },
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
      },
      {
        path: 'view/:id',
        component: () => import('../view/Index.vue'),
        meta: {
          side: true
        },
        children: [
          {
            path: '',
            name: 'peek-staff',
            component: () => import('../view/ViewStaff.vue')
          }
        ]
      },
      {
        path: ':id',
        name: 'view-staff',
        component: () => import('../view/ViewStaff.vue')
      }
    ]
  },
]

export default staffRoutes;
