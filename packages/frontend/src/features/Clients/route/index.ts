import type { RouteRecordRaw } from 'vue-router';

const clientRoutes: RouteRecordRaw[] = [
  {
    path: '/app/clients',
    meta: {
      layout: 'app',
      parent: '/app/clients',
      meta: {
        acl: ['ADMIN', 'SUPER_ADMIN']
      },
      name: 'clients',
      protected: true
    },
    children: [
      {
        path: '',
        name: 'clients',
        component: () => import('../view/Index.vue'),
        children: [
          {
            path: 'new',
            name: 'new-client',
            component: () => import('../view/AddNewClient.vue')
          },
          {
            path: 'view/:id',
            name: 'peek-client',
            meta: {
              side: true,
            },
            component: () => import('../view/View.vue')
          }
        ]
      },
      {
        path: ':id',
        name: 'view-client',
        component: () => import('../view/View.vue'),
        children: [
          {
            path: 'edit',
            name: 'edit-client',
            component: () => import('../view/Edit.vue')
          }
        ]
      }
    ]
  },
]

export default clientRoutes;
